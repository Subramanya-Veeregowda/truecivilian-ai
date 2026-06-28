package com.truecivilian.service;

import com.truecivilian.dto.*;
import com.truecivilian.exception.BadRequestException;
import com.truecivilian.exception.ResourceNotFoundException;
import com.truecivilian.model.Role;
import com.truecivilian.model.User;
import com.truecivilian.model.enums.UserRole;
import com.truecivilian.repository.RoleRepository;
import com.truecivilian.repository.UserRepository;
import com.truecivilian.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // Temporary mock storage for password reset tokens
    private final Map<String, String> resetTokens = new ConcurrentHashMap<>();

    public AuthenticationService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already in use");
        }

        Set<Role> assignedRoles = new HashSet<>();
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (String rStr : request.getRoles()) {
                try {
                    UserRole uRole = UserRole.valueOf(rStr.toUpperCase());
                    Role role = roleRepository.findByName(uRole)
                            .orElseGet(() -> {
                                Role newRole = Role.builder()
                                        .name(uRole)
                                        .description("Custom system role for " + uRole)
                                        .build();
                                return roleRepository.save(newRole);
                            });
                    assignedRoles.add(role);
                } catch (IllegalArgumentException e) {
                    throw new BadRequestException("Invalid role provided: " + rStr);
                }
            }
        } else {
            // Default Role CITIZEN
            Role citizenRole = roleRepository.findByName(UserRole.CITIZEN)
                    .orElseGet(() -> {
                        Role newRole = Role.builder()
                                .name(UserRole.CITIZEN)
                                .description("Standard citizen platform role")
                                .build();
                        return roleRepository.save(newRole);
                    });
            assignedRoles.add(citizenRole);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .wardCode(request.getWardCode())
                .isEnabled(true)
                .points(0)
                .reputationScore(5.0) // Initial neutral high reputation
                .roles(assignedRoles)
                .build();

        User savedUser = userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserResponse(savedUser))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsernameOrEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new BadRequestException("Invalid username/email or password provided");
        }

        User user = userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.getUsernameOrEmail())
                        .orElseThrow(() -> new ResourceNotFoundException("User not found")));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserResponse(user))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse refresh(TokenRefreshRequest request) {
        String refreshToken = request.getRefreshToken();
        String username;
        try {
            username = jwtService.extractUsername(refreshToken);
        } catch (Exception e) {
            throw new BadRequestException("Invalid token signature or expired token");
        }

        if (username != null) {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found for refresh token"));

            if (jwtService.isTokenValid(refreshToken, user)) {
                String newAccessToken = jwtService.generateAccessToken(user);
                return AuthResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(refreshToken)
                        .user(mapToUserResponse(user))
                        .build();
            }
        }
        throw new BadRequestException("Invalid or expired refresh token");
    }

    public void logout(String authHeader) {
        // stateless JWT logout is mainly handled client-side, but can blacklist tokens here if needed.
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + request.getEmail()));

        // Generate a simple, unique recovery UUID token
        String resetToken = UUID.randomUUID().toString();
        resetTokens.put(resetToken, user.getEmail());

        // In production, an email dispatcher would send this link to user.
        return resetToken;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = resetTokens.get(request.getToken());
        if (email == null) {
            throw new BadRequestException("Invalid or expired reset token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User associated with token not found"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Remove token once consumed
        resetTokens.remove(request.getToken());
    }

    private UserResponse mapToUserResponse(User user) {
        Set<UserRole> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .isEnabled(user.getIsEnabled())
                .points(user.getPoints())
                .reputationScore(user.getReputationScore())
                .wardCode(user.getWardCode())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
