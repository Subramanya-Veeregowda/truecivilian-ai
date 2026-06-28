import React from "react";
import { Spinner, SkeletonCard } from "../../ui/Feedback";
import { motion } from "motion/react";

export const LoadingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center space-y-6"
      >
        <Spinner size="lg" />
        <div className="space-y-2">
          <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-white">
            Syncing Geo-Spatial Coordinates...
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Resolving live active municipal logs, route plans, and cached assets. Please hold.
          </p>
        </div>

        {/* Display Skeletal Preview inside loading state */}
        <div className="pt-4 text-left">
          <SkeletonCard rows={3} />
        </div>
      </motion.div>
    </div>
  );
};
