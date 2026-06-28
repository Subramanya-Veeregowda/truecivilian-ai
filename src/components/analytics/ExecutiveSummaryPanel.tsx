import React from "react";
import { BookOpen, Sparkles, AlertCircle, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardBody } from "../ui/Card";

interface SummaryStats {
  totalReports: number;
  openIssues: number;
  closedIssues: number;
  avgResolutionTimeDays: number;
  departmentSla: number;
  topWard: string;
  topCategory: string;
}

interface ExecutiveSummaryPanelProps {
  stats: SummaryStats;
  loading?: boolean;
}

export const ExecutiveSummaryPanel: React.FC<ExecutiveSummaryPanelProps> = ({ stats, loading = false }) => {
  // Generate smart descriptions based on metrics
  const getSlaAssessment = () => {
    if (stats.departmentSla >= 90) {
      return "SLA resolution performance is exemplary, indicating efficient dispatch and action across public services.";
    } else if (stats.departmentSla >= 80) {
      return "SLA compliance is within acceptable margins, though minor backlogs are present in municipal units.";
    } else {
      return "Critical warning: SLA deadlines are being missed; attention is recommended on under-performing departments.";
    }
  };

  const getWardTension = () => {
    if (stats.openIssues > 50) {
      return `Congestion remains prominent in ${stats.topWard || "Ward 12"}, specifically regarding ${stats.topCategory || "Roads & Potholes"} reports.`;
    } else {
      return `Filing flows remain stable; ${stats.topWard || "Ward 12"} continues to capture the highest density of new submissions.`;
    }
  };

  return (
    <Card variant="default" className="flex flex-col" id="card-executive-summary">
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Executive Intelligence Summary</h3>
            <p className="text-xs text-zinc-400">NLP-derived narrative analyzing municipal health indicators</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex-grow p-5 space-y-4 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zinc-950/50">
            <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Autonomous Trend Summary</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                  Currently, TrueCivilian AI is coordinating <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.totalReports} total reports</span>. 
                  Out of these, <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.closedIssues} complaints</span> have been successfully resolved, leaving <span className="font-bold text-zinc-800 dark:text-zinc-200">{stats.openIssues} active tasks</span>.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2.5">
                <ArrowUpRight className="h-4 w-4 text-zinc-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-300">Operational Velocity</h4>
                  <p className="text-xs text-zinc-400 leading-normal mt-0.5">
                    Mean resolution speed is sustained at <span className="font-semibold text-zinc-700 dark:text-zinc-300">{stats.avgResolutionTimeDays.toFixed(1)} days</span>. 
                    {getSlaAssessment()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                <AlertCircle className="h-4 w-4 text-zinc-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-300">Ward Density Breakdown</h4>
                  <p className="text-xs text-zinc-400 leading-normal mt-0.5">
                    {getWardTension()} The primary category of concern across active wards remains <span className="font-semibold text-zinc-700 dark:text-zinc-300">{stats.topCategory || "Roads & Potholes"}</span>.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};
