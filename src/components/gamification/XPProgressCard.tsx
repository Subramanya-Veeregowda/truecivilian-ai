import React from "react";
import { Zap, Target, Star } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { motion } from "motion/react";

interface XPProgressCardProps {
  points: number;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  reputationScore?: number;
}

export const XPProgressCard: React.FC<XPProgressCardProps> = ({
  points = 120,
  level = 2,
  currentXP = 20,
  nextLevelXP = 100,
  reputationScore = 12.0,
}) => {
  const percentage = Math.min((currentXP / nextLevelXP) * 100, 100);

  return (
    <Card variant="default" className="relative overflow-hidden" id="xp-progress-card">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />

      <CardBody className="p-5 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4.5 w-full md:w-auto">
          {/* Level badge circle */}
          <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex flex-col items-center justify-center text-white font-black shadow-lg shadow-emerald-500/10 shrink-0">
            <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-80 leading-none">Level</span>
            <span className="text-2xl mt-0.5 leading-none">{level}</span>
            <Star className="absolute -top-1 -right-1 h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
          </div>

          <div className="space-y-1.5 flex-grow">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">District Overseer Profile</h3>
                <p className="text-[11px] text-zinc-400 font-medium">Earned +{points} total XP across public service audits</p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {currentXP} / {nextLevelXP} XP
              </span>
            </div>

            {/* Custom progressive bar with motion/react */}
            <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200/20 dark:border-zinc-700/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Dynamic status stats block */}
        <div className="grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800/60 pt-4 md:pt-0 md:pl-6 w-full md:w-auto shrink-0">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Reputation</span>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500" />
              <span className="text-sm font-black text-zinc-800 dark:text-zinc-100">
                {reputationScore?.toFixed(1) || "0.0"}
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Next Goal</span>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-zinc-400" />
              <span className="text-sm font-black text-zinc-850 dark:text-zinc-300">
                Level {level + 1}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
