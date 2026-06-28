import React from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { OfficerWorkloadResponse } from "./types";
import { UserCheck, Star, Clock, Hammer, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface OfficerWorkloadBoardProps {
  officers: OfficerWorkloadResponse[];
}

export const OfficerWorkloadBoard: React.FC<OfficerWorkloadBoardProps> = ({ officers }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCheck className="h-4.5 w-4.5 text-emerald-500" />
          <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
            Field Officer Workloads & Ratings
          </h3>
        </div>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded font-mono font-bold">
          {officers.length} ACTIVE CREW
        </span>
      </CardHeader>
      <CardBody className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officers.map((officer, idx) => {
            return (
              <div 
                key={officer.officerId || idx}
                className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-800/20 space-y-4 hover:border-indigo-500/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                      {officer.officerName}
                    </h4>
                    <span className="text-[9px] text-zinc-400 uppercase font-mono mt-0.5 block">
                      {officer.officerRole || "Field Deputy"}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-mono font-black">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {officer.efficiencyRating}%
                    </span>
                    <span className="block text-[8px] text-zinc-400 font-mono mt-1 uppercase">
                      Efficiency
                    </span>
                  </div>
                </div>

                {/* Counter Stats Grid */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                  <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200/10">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    <span>Active: <strong>{officer.activeAssignmentsCount}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200/10">
                    <Hammer className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Done: <strong>{officer.completedCount}</strong></span>
                  </div>
                </div>

                {/* Mini assigned issues list */}
                {officer.assignedIssues && officer.assignedIssues.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">
                      Active Assignments
                    </span>
                    <div className="space-y-1">
                      {officer.assignedIssues.map((issue, iIdx) => (
                        <div 
                          key={issue.id || iIdx} 
                          className="flex justify-between items-center bg-white/40 dark:bg-zinc-900/40 p-1.5 rounded text-[9px] font-mono border border-zinc-200/10 truncate"
                        >
                          <span className="text-zinc-600 dark:text-zinc-300 truncate max-w-[140px]">
                            {issue.title}
                          </span>
                          <span className="text-[8px] bg-amber-500/5 text-amber-500 border border-amber-500/10 px-1 py-0.2 rounded font-bold uppercase shrink-0">
                            {issue.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
