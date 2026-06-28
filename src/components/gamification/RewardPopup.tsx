import React from "react";
import { Zap, X, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface RewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  xpAmount: number;
  reason: string;
}

export const RewardPopup: React.FC<RewardPopupProps> = ({
  isOpen,
  onClose,
  xpAmount = 25,
  reason = "Submitted verified report"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4" id="reward-popup-overlay">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-zinc-950 dark:bg-zinc-900 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/30 flex items-center gap-4 relative overflow-hidden"
          >
            {/* Animated glowing backdrop radial */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />

            {/* Spark/Zap badge icon */}
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0 animate-bounce">
              <Zap className="h-6 w-6 fill-current" />
            </div>

            <div className="space-y-1 pr-6 flex-grow">
              <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase block">Civic Reward</span>
              <h4 className="text-sm font-black flex items-center gap-1.5 text-zinc-50">
                <span>XP Reward Unlocked!</span>
              </h4>
              <p className="text-[11px] text-zinc-400 font-medium leading-tight">
                You earned <span className="text-emerald-400 font-bold">+{xpAmount} XP</span> for: {reason}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              aria-label="Dismiss Alert"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
