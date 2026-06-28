import React from "react";
import { Award, Trophy, Star, ChevronRight, Calendar } from "lucide-react";

interface TimelineItem {
  id: string;
  type: "BADGE" | "CHALLENGE";
  title: string;
  description: string;
  icon: string;
  timestamp: string;
  reward: string;
}

interface AchievementTimelineProps {
  items: TimelineItem[];
}

export const AchievementTimeline: React.FC<AchievementTimelineProps> = ({ items = [] }) => {
  const getIconComponent = (item: TimelineItem) => {
    if (item.type === "BADGE") {
      return <Award className="h-5 w-5 text-amber-500" />;
    }
    return <Trophy className="h-5 w-5 text-emerald-500" />;
  };

  const getTimelineDate = (timestampStr: string) => {
    try {
      const d = new Date(timestampStr);
      if (isNaN(d.getTime())) return timestampStr;
      return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return timestampStr;
    }
  };

  return (
    <div className="space-y-4" id="achievement-timeline-root">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          Achievement Chronicle
        </h3>
        <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">
          {items.length} milestones unlocked
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-12 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-zinc-200/50 dark:border-zinc-850 text-center text-xs text-zinc-400">
          <Star className="h-6 w-6 text-zinc-300 dark:text-zinc-700 mx-auto mb-2 animate-pulse" />
          <p className="font-semibold">Your chronicle is quiet.</p>
          <p className="text-[10px] text-zinc-400/80 mt-1">Complete daily activities and gain XP to write history!</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-zinc-200/80 dark:border-zinc-800/80 pl-6 space-y-6 py-2 ml-3">
          {items.map((item, idx) => (
            <div key={item.id || idx} className="relative group" id={`timeline-item-${idx}`}>
              
              {/* Timeline marker node */}
              <div className="absolute -left-[35px] top-1.5 h-6 w-6 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center group-hover:border-emerald-500 transition-colors shadow-sm">
                {getIconComponent(item)}
              </div>

              {/* Timeline Item Content Card */}
              <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/50 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-750 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-zinc-850 dark:text-zinc-50">
                      {item.title}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      item.type === "BADGE" 
                        ? "bg-amber-500/10 text-amber-600" 
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-450 dark:text-zinc-400 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-850 pt-2 sm:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 block">
                      {item.reward}
                    </span>
                    <span className="text-[9px] text-zinc-400 flex items-center gap-1 justify-end font-mono mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {getTimelineDate(item.timestamp)}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-400 transition-colors" />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
