import React from "react";
import { Brain, Cpu, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { Card, CardHeader, CardBody } from "../ui/Card";

interface AIData {
  triagedCount: number;
  classificationAccuracy: number;
  duplicateDetectionAccuracy: number;
  falsePositives: number;
  truePositives: number;
  aiTriageLatencyMs: number;
}

interface AIAccuracyDashboardProps {
  data: AIData;
  loading?: boolean;
}

export const AIAccuracyDashboard: React.FC<AIAccuracyDashboardProps> = ({ data, loading = false }) => {
  const metrics = [
    {
      label: "AI Auto-Triage Rate",
      value: "98.7%",
      desc: "Issues automatically categorized & routed",
      icon: Sparkles,
      color: "text-violet-500",
      bg: "bg-violet-500/10"
    },
    {
      label: "AI Classification Accuracy",
      value: `${data.classificationAccuracy.toFixed(1)}%`,
      desc: "Correct category/priority pairings",
      icon: Cpu,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      label: "Duplicate Detection Accuracy",
      value: `${data.duplicateDetectionAccuracy.toFixed(1)}%`,
      desc: "Duplicate report matching rate",
      icon: ShieldAlert,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    {
      label: "Mean Triage Latency",
      value: `${data.aiTriageLatencyMs} ms`,
      desc: "Average routing speed per complaint",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ];

  return (
    <Card variant="default" className="flex flex-col" id="card-ai-accuracy">
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg">
            <Brain className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">AI Triage & Classification Intelligence</h3>
            <p className="text-xs text-zinc-400">Gemini LLM model accuracy and duplicate cluster analysis</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex-grow p-5 space-y-6 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zinc-950/50">
            <div className="animate-spin h-5 w-5 border-2 border-violet-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Bento Grid Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {metrics.map((m, idx) => {
                const IconComponent = m.icon;
                return (
                  <div 
                    key={idx} 
                    id={`ai-metric-box-${idx}`}
                    className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/10 border border-zinc-150 dark:border-zinc-800/40 hover:border-violet-500/20 transition-all flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-lg ${m.color} ${m.bg} shrink-0`}>
                      <IconComponent className="h-4.5 w-4.5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{m.label}</p>
                      <h4 className="text-xl font-black text-zinc-900 dark:text-zinc-100">{m.value}</h4>
                      <p className="text-[10px] text-zinc-400 leading-normal">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confusion Matrix / Duplicate Stats */}
            <div className="p-4 rounded-xl bg-violet-50/20 dark:bg-violet-500/5 border border-violet-100 dark:border-violet-950/30">
              <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                Duplicate Verification Cluster Matrix
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase">Evaluated</span>
                  <p className="text-base font-extrabold text-zinc-800 dark:text-zinc-100 mt-1">{data.triagedCount}</p>
                </div>
                <div className="p-3 bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase">True Positives</span>
                  <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">+{data.truePositives}</p>
                </div>
                <div className="p-3 bg-white dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase">False Positives</span>
                  <p className="text-base font-extrabold text-rose-500 mt-1">-{data.falsePositives}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};
