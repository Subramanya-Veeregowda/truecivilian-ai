import React from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { DepartmentPerformanceResponse } from "./types";
import { Landmark, TrendingUp, ShieldCheck, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface DepartmentPerformanceWidgetProps {
  performance: DepartmentPerformanceResponse[];
}

export const DepartmentPerformanceWidget: React.FC<DepartmentPerformanceWidgetProps> = ({ performance }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Landmark className="h-4 w-4 text-emerald-500" />
          <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
            Departmental Dispatch & Performance
          </h3>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold font-mono">
          SLA MONITORED
        </span>
      </CardHeader>
      <CardBody className="space-y-6">
        {performance.map((dept, idx) => {
          // Color based on compliance
          const complianceColor = 
            dept.slaComplianceRate >= 95 ? "text-emerald-500" :
            dept.slaComplianceRate >= 90 ? "text-amber-500" : "text-rose-500";

          return (
            <div key={dept.departmentId || idx} className="space-y-3 pb-4 border-b border-zinc-100 dark:border-zinc-800/40 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {dept.departmentName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Backlog: <strong className="text-zinc-700 dark:text-zinc-300">{dept.activeBacklog}</strong>
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-700 font-mono text-[10px]">•</span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Solved: <strong className="text-zinc-700 dark:text-zinc-300">{dept.resolvedCount}</strong>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black font-mono ${complianceColor}`}>
                    {dept.slaComplianceRate}%
                  </span>
                  <span className="block text-[9px] text-zinc-400 uppercase font-mono mt-0.5">
                    SLA Compliance
                  </span>
                </div>
              </div>

              {/* Progress bar representing resolution rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Resolution Rate</span>
                  <span>{dept.resolutionRate}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.resolutionRate}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                  />
                </div>
              </div>

              {/* Extra micro-analytics block */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-mono text-zinc-400">
                <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-950/40 px-2 py-1 rounded-md">
                  <TrendingUp className="h-3 w-3 text-indigo-400" />
                  <span>Avg Speed: {dept.averageResolutionTimeHours}h</span>
                </div>
                {dept.overdueCount > 0 ? (
                  <div className="flex items-center gap-1.5 bg-rose-500/5 text-rose-500 dark:text-rose-400 px-2 py-1 rounded-md">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Overdue: {dept.overdueCount}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-emerald-500/5 text-emerald-500 dark:text-emerald-400 px-2 py-1 rounded-md">
                    <ShieldCheck className="h-3 w-3" />
                    <span>All within SLA</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};
