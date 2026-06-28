# =======================================================
# Stage 1: Build the Spring Boot Application
# =======================================================
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy the pom.xml first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application artifact
COPY src ./src
RUN mvn clean package -DskipTests -B

# =======================================================
# Stage 2: Runtime Environment with Lightweight JRE
# =======================================================
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Create a non-privileged system user for runtime isolation
RUN addgroup -S civilian && adduser -S civilian -G civilian
USER civilian

# Copy compiled jar from building environment
COPY --from=builder /app/target/*.jar app.jar

# Spring Boot production configurations
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
