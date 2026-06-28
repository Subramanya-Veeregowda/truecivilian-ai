import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useShell } from "../../context/ShellContext";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Lock, ArrowLeft, Key, Check, Eye, EyeOff, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const { addNotification } = useNotifications();
  const { setLayout } = useShell();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load token if generated in forgot-password
  useEffect(() => {
    const savedToken = sessionStorage.getItem("recoveryResetToken");
    if (savedToken) {
      setToken(savedToken);
      sessionStorage.removeItem("recoveryResetToken"); // Clean up
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword({ token, newPassword });
      setIsSuccess(true);
      addNotification("Credentials Reset Success", "Your password has been successfully updated.", "success");
    } catch (err: any) {
      setError(err?.toString() || "Failed to update credentials. Please check your token validity.");
      addNotification("Credentials Reset Failed", err?.toString() || "Please try again.", "error");
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
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="font-display font-semibold text-2xl text-zinc-900 dark:text-white">
                Set New Password
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Finalize your security override credentials
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

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Verification / Reset Token"
                  placeholder="Paste your generated UUID reset token"
                  icon={Key}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  disabled={isLoading}
                />

                <div className="relative">
                  <Input
                    label="New Secure Password (Min 8 chars)"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter brand new password"
                    icon={Lock}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center py-3 font-semibold tracking-wide"
                  isLoading={isLoading}
                  icon={Check}
                >
                  Update Credentials
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold block text-sm text-zinc-900 dark:text-white">Credentials Overridden</span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Your master account security password has been updated and registered across our authentication node.
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setLayout("login")}
                  className="w-full justify-center py-2.5 font-semibold"
                >
                  Return and Sign In
                </Button>
              </div>
            )}

            {!isSuccess && (
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 text-center">
                <button
                  onClick={() => setLayout("login")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Return to Access Gate</span>
                </button>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
