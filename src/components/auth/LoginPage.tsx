import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useShell } from "../../context/ShellContext";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { LogIn, Mail, Lock, Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { addNotification } = useNotifications();
  const { setLayout } = useShell();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(usernameOrEmail, password);
      addNotification("Login Successful", "Welcome back to TrueCivilian AI portal.", "success");
    } catch (err: any) {
      setError(err?.toString() || "Invalid username or password.");
      addNotification("Authentication Failed", err?.toString() || "Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50">
          <CardHeader>
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <h2 className="font-display font-semibold text-2xl text-zinc-900 dark:text-white">
                Access Security Vault
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Sign in to your authorized TrueCivilian AI account
              </p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4 pt-2">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-500/15 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 leading-normal animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username or Email"
                placeholder="Enter your user handle or email"
                icon={Mail}
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                required
                disabled={isLoading}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter secure master password"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 bottom-3 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setLayout("forgot-password")}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Forgot Master Password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center py-3 font-semibold tracking-wide"
                isLoading={isLoading}
                icon={LogIn}
              >
                Unlock Account
              </Button>
            </form>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 text-center text-xs text-zinc-500 dark:text-zinc-400">
              New to TrueCivilian AI?{" "}
              <button
                onClick={() => setLayout("register")}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Register Citizen Access
              </button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
