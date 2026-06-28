import React from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Activity, Clock, Wrench, UserCheck, AlertCircle } from "lucide-react";
import { ActivityDto } from "./types";

interface RecentActivityTimelineProps {
  activities: ActivityDto[];
}

export const RecentActivityTimeline: React.FC<RecentActivityTimelineProps> = ({ activities }) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case "ASSIGNMENT":
        return { icon: UserCheck, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
      case "RESOLUTION":
        return { icon: Wrench, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
      case "AI_ANALYSIS":
        return { icon: Activity, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" };
      default:
        return { icon: Clock, color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20" };
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Just now";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500" />
          <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
            Operations Audit Log
          </h3>
        </div>
        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded font-mono font-bold">
          LIVE STREAM
        </span>
      </CardHeader>
      <CardBody className="p-6">
        <div className="relative border-l border-zinc-100 dark:border-zinc-800/80 pl-6 space-y-6">
          {activities.map((act, idx) => {
            const config = getIconForType(act.type);
            const Icon = config.icon;

            return (
              <div key={act.id || idx} className="relative group">
                {/* Timeline Dot Indicator */}
                <div className={`absolute -left-[37px] top-0.5 p-1.5 rounded-xl border ${config.color} z-10 transition-transform group-hover:scale-110`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                      {act.type}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {formatTime(act.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {act.issueTitle && (
                      <span className="text-[9px] bg-zinc-50 dark:bg-zinc-950/40 text-zinc-500 dark:text-zinc-400 border border-zinc-200/20 px-2 py-0.5 rounded font-mono truncate max-w-[180px]">
                        {act.issueTitle}
                      </span>
                    )}
                    {act.reporterName && (
                      <span className="text-[9px] text-zinc-400 font-mono">
                        by {act.reporterName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
