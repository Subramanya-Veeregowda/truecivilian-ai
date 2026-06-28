import React from "react";
import { Button } from "../../ui/Button";
import { useShell } from "../../../context/ShellContext";
import { Compass, Home, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

export const Page404: React.FC = () => {
  const { setLayout } = useShell();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md space-y-6"
      >
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <HelpCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-black text-6xl text-zinc-900 dark:text-white">404</h1>
          <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
            Ward Sector Not Found
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
            The civic route coordinates you are seeking do not exist or are currently restricted to authorized surveyors.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            variant="primary"
            onClick={() => setLayout("landing")}
            icon={Home}
          >
            Back to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => setLayout("authenticated")}
            icon={Compass}
          >
            Explore Map
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
