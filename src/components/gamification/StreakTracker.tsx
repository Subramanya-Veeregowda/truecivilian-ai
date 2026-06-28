import React from "react";
import { Flame, Calendar, Award } from "lucide-react";
import { Card, CardBody } from "../ui/Card";

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  activityDays: boolean[]; // Mon to Sun active state (length 7)
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({
  currentStreak = 3,
  longestStreak = 12,
  activityDays = [true, true, true, false, false, false, false],
}) => {
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Card variant="default" className="overflow-hidden" id="streak-tracker-card">
      <CardBody className="p-5 flex flex-col sm:flex-row items-center gap-5 justify-between relative">
        <div className="flex items-center gap-4">
          {/* Flame burning icon */}
          <div className="relative p-4 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl text-amber-500 animate-pulse shrink-0">
            <Flame className="h-7 w-7 text-amber-500 fill-amber-500" />
            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow">
              {currentStreak}
            </span>
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5 justify-center sm:justify-start">
              <span>Filing Streak: {currentStreak} Days</span>
            </h3>
            <p className="text-[11px] text-zinc-400">Keep filing reports to keep the neighborhood clean and boost points!</p>
          </div>
        </div>

        {/* Days of week checklist */}
        <div className="flex items-center gap-2">
          {weekDays.map((day, idx) => {
            const isActive = activityDays[idx];
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-zinc-400">{day}</span>
                <div
                  id={`streak-day-${idx}`}
                  className={`h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all border ${
                    isActive
                      ? "bg-amber-500 border-amber-600 text-white shadow-sm"
                      : "bg-zinc-50 border-zinc-200/50 dark:bg-zinc-800/40 dark:border-zinc-850 text-zinc-400"
                  }`}
                >
                  {isActive ? <Flame className="h-3.5 w-3.5 fill-current" /> : day}
                </div>
              </div>
            );
          })}
        </div>

        {/* Longest streak record banner */}
        <div className="border-t sm:border-t-0 sm:border-l border-zinc-150 dark:border-zinc-800/60 pt-4 sm:pt-0 sm:pl-5 flex flex-col items-center shrink-0">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">All-Time High</span>
          <p className="text-lg font-black text-amber-500 flex items-center gap-1 mt-0.5">
            <Award className="h-4.5 w-4.5" />
            {longestStreak} Days
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
