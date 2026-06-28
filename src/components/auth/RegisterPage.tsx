import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useShell } from "../../context/ShellContext";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input, Select } from "../ui/Input";
import { UserPlus, User, Mail, Lock, Phone, MapPin, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { addNotification } = useNotifications();
  const { setLayout } = useShell();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [role, setRole] = useState("CITIZEN");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!username || !email || !password || !firstName || !lastName) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      username,
      email,
      password,
      firstName,
      lastName,
      phone: phone || undefined,
      wardCode: wardCode || undefined,
      roles: [role],
    };

    try {
      await register(payload);
      addNotification("Registration Successful", `Citizen profile ${username} created. Welcome aboard!`, "success");
    } catch (err: any) {
      setError(err?.toString() || "Registration failed. Try different credentials.");
      addNotification("Registration Failed", err?.toString() || "Please verify your input fields.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50">
          <CardHeader>
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 items-center justify-center">
                <UserPlus className="h-6 w-6" />
              </div>
              <h2 className="font-display font-semibold text-2xl text-zinc-900 dark:text-white">
                Register Citizen Access
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Join the AI-powered community civic action portal
              </p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4 pt-1">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-500/15 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 leading-normal">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  placeholder="John"
                  icon={User}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Input
                  label="Last Name *"
                  placeholder="Doe"
                  icon={User}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Username *"
                  placeholder="johndoe"
                  icon={User}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="johndoe@example.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password * (Min 8 characters)"
                  type="password"
                  placeholder="********"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Input
                  label="Phone Number"
                  placeholder="+1234567890"
                  icon={Phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Ward Code / Postal Area"
                  placeholder="Ward-102"
                  icon={MapPin}
                  value={wardCode}
                  onChange={(e) => setWardCode(e.target.value)}
                  disabled={isLoading}
                />
                <Select
                  label="Assigned System Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isLoading}
                  options={[
                    { value: "CITIZEN", label: "Citizen" },
                    { value: "VOLUNTEER", label: "Volunteer Verifier" },
                    { value: "AUTHORITY", label: "Authority Board" },
                    { value: "ADMIN", label: "System Administrator" },
                  ]}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center py-3 font-semibold tracking-wide"
                isLoading={isLoading}
                icon={Sparkles}
              >
                Create Citizen Profile
              </Button>
            </form>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Already have an authorized profile?{" "}
              <button
                onClick={() => setLayout("login")}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Sign In Instead
              </button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
