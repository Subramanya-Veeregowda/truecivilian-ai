import React from "react";
import { ErrorState } from "../../ui/Feedback";
import { useShell } from "../../../context/ShellContext";
import { motion } from "motion/react";

export const ErrorLayout: React.FC = () => {
  const { setLayout } = useShell();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl"
      >
        <ErrorState
          message="Simulated system exception occurred. The database integration socket timed out because authentication credentials are not active yet."
          onRetry={() => setLayout("landing")}
        />
      </motion.div>
    </div>
  );
};
