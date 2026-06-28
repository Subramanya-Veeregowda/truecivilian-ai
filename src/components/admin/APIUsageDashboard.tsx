import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { BarChart3, TrendingUp, Compass } from "lucide-react";
import api from "../../lib/api";

interface UsageStats {
  [key: string]: number;
}

export const APIUsageDashboard: React.FC = () => {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await api.get("/admin/system-health");
        setStats(response.data.apiUsageStats);
      } catch (err) {
        console.error("Failed to query API usage logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsage();
  }, []);

  if (loading) {
    return <div className="text-xs text-zinc-400 py-6 text-center font-mono">Parsing raw API telemetry logs...</div>;
  }

  if (!stats) {
    return <div className="text-xs text-red-400 py-6 text-center">Unable to load API usage logs.</div>;
  }

  // Convert map to list and sort by values desc
  const sortedStats = Object.entries(stats).map(([endpoint, count]) => ({
    endpoint,
    count: Number(count),
  })).sort((a, b) => b.count - a.count);

  const maxVal = sortedStats.length > 0 ? sortedStats[0].count : 1;

  return (
    <div id="admin-api-usage-dashboard" className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
          API Traffic & Telemetry Logs
        </h3>
        <p className="text-xs text-zinc-500">
          Analyze traffic distribution, track frequent API operations, and ensure capacity compliance.
        </p>
      </div>

      <Card className="border border-zinc-200/60 dark:border-zinc-800/60">
        <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-emerald-500 stroke-[2.2]" />
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
              Top Endpoint Invocation Frequency
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
            <Compass className="h-3.5 w-3.5 text-zinc-500" />
            <span>REAL-TIME ANALYSIS</span>
          </div>
        </CardHeader>
        <CardBody className="p-6 space-y-6">
          <div className="space-y-4">
            {sortedStats.map((item) => {
              const percentage = Math.max(5, Math.round((item.count / maxVal) * 100));
              return (
                <div key={item.endpoint} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-zinc-700 dark:text-zinc-300 font-bold">
                      {item.endpoint}
                    </span>
                    <span className="font-mono text-zinc-500 font-bold">{item.count.toLocaleString()} calls</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-850 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
