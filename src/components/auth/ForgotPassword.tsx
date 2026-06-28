import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { useShell } from "../../context/ShellContext";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Mail, ArrowLeft, Key, Clipboard, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const { addNotification } = useNotifications();
  const { setLayout } = useShell();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please provide a registered email address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await forgotPassword(email);
      setResetToken(token);
      addNotification("Recovery Code Dispatched", "A verification reset token has been generated.", "success");
    } catch (err: any) {
      setError(err?.toString() || "No account was found with that email address.");
      addNotification("Dispatch Failed", "Verify your email input handle and try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToken = () => {
    if (resetToken) {
      navigator.clipboard.writeText(resetToken);
      addNotification("Token Copied", "Verification token saved to clipboard.", "info");
    }
  };

  const handleProceedToReset = () => {
    // Store token temporarily in session storage to pre-fill the reset form
    if (resetToken) {
      sessionStorage.setItem("recoveryResetToken", resetToken);
    }
    setLayout("reset-password");
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
                <Key className="h-6 w-6" />
              </div>
              <h2 className="font-display font-semibold text-2xl text-zinc-900 dark:text-white">
                Recover Account
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Generate a secure authorization override token
              </p>
            </div>
          </CardHeader>
          <CardBody className="space-y-4 pt-1">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-500/15 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 leading-normal">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!resetToken ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Registered Email Address"
                  type="email"
                  placeholder="johndoe@example.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center py-3 font-semibold tracking-wide"
                  isLoading={isLoading}
                  icon={ChevronRight}
                >
                  Generate Token
                </Button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs space-y-3">
                  <div className="flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="font-bold block text-sm mb-0.5">Authorization Code Generated!</span>
                      <span>Your override token was calculated successfully. Use the button below to update your password credentials.</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-emerald-500/10 flex items-center justify-between gap-2">
                    <code className="font-mono text-[11px] font-bold select-all break-all text-zinc-800 dark:text-zinc-200">
                      {resetToken}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                      title="Copy Token"
                    >
                      <Clipboard className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={handleProceedToReset}
                  className="w-full justify-center py-3 font-semibold tracking-wide"
                  icon={ChevronRight}
                >
                  Proceed to Password Reset
                </Button>
              </div>
            )}

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 text-center">
              <button
                onClick={() => setLayout("login")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Access Gate</span>
              </button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};
