import React from "react";
import { Star, Award, PartyPopper, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  iconName?: string;
  pointsAwarded?: number;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  isOpen,
  onClose,
  title = "Level Up!",
  subtitle = "Congratulations! You have advanced to Level 3 and unlocked new authority privileges.",
  iconName = "lucide-zap",
  pointsAwarded = 100,
}) => {
  const getBadgeIcon = (name: string) => {
    switch (name) {
      case "lucide-eye":
        return <Award className="h-16 w-16 text-amber-500 fill-amber-500/10" />;
      case "lucide-check-circle":
        return <Award className="h-16 w-16 text-blue-500 fill-blue-500/10" />;
      case "lucide-zap":
        return <Award className="h-16 w-16 text-emerald-500 fill-emerald-500/10" />;
      case "lucide-leaf":
        return <Award className="h-16 w-16 text-teal-500 fill-teal-500/10" />;
      case "lucide-shield-check":
        return <Award className="h-16 w-16 text-purple-500 fill-purple-500/10" />;
      default:
        return <PartyPopper className="h-16 w-16 text-emerald-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="milestone-modal-container">
          {/* Blur backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-md"
          />

          {/* Celebratory Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 text-center shadow-2xl z-10 overflow-hidden"
          >
            {/* Spinning background rays */}
            <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-emerald-500/15 to-transparent flex items-center justify-center opacity-80 pointer-events-none">
              <div className="w-96 h-96 rounded-full bg-radial from-emerald-500/5 via-transparent to-transparent blur-3xl animate-pulse" />
            </div>

            {/* Sparkles elements */}
            <div className="absolute top-8 left-8 text-amber-400 animate-pulse">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="absolute top-12 right-12 text-amber-400 animate-pulse">
              <Star className="h-4 w-4 fill-current" />
            </div>

            <div className="relative space-y-5 pt-4">
              {/* Badge Emblem box */}
              <div className="mx-auto h-28 w-28 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border-4 border-emerald-500/30 flex items-center justify-center shadow-lg relative">
                {getBadgeIcon(iconName)}
                <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-white rounded-lg shadow animate-bounce">
                  <Star className="h-4.5 w-4.5 fill-current" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Milestone Unlocked
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {title}
                </h2>
                <p className="text-xs text-zinc-455 dark:text-zinc-400 leading-relaxed font-medium px-4">
                  {subtitle}
                </p>
              </div>

              {pointsAwarded > 0 && (
                <div className="mx-auto max-w-[140px] px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black text-xs">
                  Bonus: +{pointsAwarded} XP
                </div>
              )}

              <div className="pt-2">
                <button
                  id="btn-dismiss-milestone-celebration"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                >
                  <Check className="h-4.5 w-4.5" /> Acknowledge Honors
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
