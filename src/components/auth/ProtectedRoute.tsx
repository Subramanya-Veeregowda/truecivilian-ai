import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useShell } from "../../context/ShellContext";
import { useNotifications } from "../../context/NotificationContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { setLayout } = useShell();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!isLoading && !user) {
      setLayout("login");
      addNotification("Authorization Required", "Please sign in to access your authorized workspace shell.", "info");
    }
  }, [user, isLoading, setLayout]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Verifying secure node session...</span>
      </div>
    );
  }

  if (!user) {
    return null; // Effector will trigger state redirection in useEffect
  }

  return <>{children}</>;
};
