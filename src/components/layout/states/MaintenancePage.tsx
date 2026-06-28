import React from "react";
import { Button } from "../../ui/Button";
import { useShell } from "../../../context/ShellContext";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export const MaintenancePage: React.FC = () => {
  const { setLayout } = useShell();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md space-y-6"
      >
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto animate-bounce">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-bold text-2xl text-zinc-900 dark:text-white">
            Under Scheduled Maintenance
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
            The municipal coordinate database is currently running a background database defragmentation schema sync. We will be back shortly!
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={() => setLayout("landing")}
            icon={RefreshCw}
          >
            Check Server Connection
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
