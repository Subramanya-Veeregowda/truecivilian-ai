import React, { useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Activity, HelpCircle } from "lucide-react";

interface MonthlyTrend {
  month: string;
  reported: number;
  resolved: number;
}

interface IssueTrendChartProps {
  data: MonthlyTrend[];
  loading?: boolean;
}

export const IssueTrendChart: React.FC<IssueTrendChartProps> = ({ data, loading = false }) => {
  const [activeMetric, setActiveMetric] = useState<"all" | "reported" | "resolved">("all");

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/95 dark:bg-zinc-950/95 border border-zinc-800 backdrop-blur-md p-3.5 rounded-xl shadow-xl text-xs space-y-1.5">
          <p className="font-bold text-zinc-100">{label}</p>
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 justify-between">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}:
              </span>
              <span className="font-extrabold text-zinc-50">{item.value} issues</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="default" className="h-[400px] flex flex-col" id="card-issue-trend">
      <CardHeader className="py-4 flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Issue Filing & Resolution Trends</h3>
            <p className="text-xs text-zinc-400">Monthly volume of incoming vs closed issues</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl">
          {(["all", "reported", "resolved"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMetric(mode)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                activeMetric === mode
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardBody className="flex-1 min-h-0 p-4 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zinc-950/50">
            <div className="animate-pulse flex space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.15)" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#888888", fontSize: 11, fontWeight: 500 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#888888", fontSize: 11, fontWeight: 500 }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: 12, fontWeight: 500, color: "#888888" }}
              />
              {(activeMetric === "all" || activeMetric === "reported") && (
                <Area
                  type="monotone"
                  name="Reported Issues"
                  dataKey="reported"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReported)"
                />
              )}
              {(activeMetric === "all" || activeMetric === "resolved") && (
                <Area
                  type="monotone"
                  name="Resolved Issues"
                  dataKey="resolved"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
};
