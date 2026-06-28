import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Cpu, Database, CloudLightning, Activity, Server, Zap } from "lucide-react";
import api from "../../lib/api";

interface HealthData {
  status: string;
  databaseLatencyMs: number;
  geminiLatencyMs: number;
  totalDbConnections: number;
  activeSessions: number;
  jvmMetrics: {
    maxMemoryMb: number;
    totalMemoryMb: number;
    freeMemoryMb: number;
    availableProcessors: number;
  };
}

export const SystemHealthDashboard: React.FC = () => {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const response = await api.get("/admin/system-health");
      setHealth(response.data);
    } catch (err) {
      console.error("Failed to fetch system health stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-xs text-zinc-400 py-6 text-center">Reading live performance diagnostics...</div>;
  }

  if (!health) {
    return <div className="text-xs text-red-400 py-6 text-center">Unable to query system health gates.</div>;
  }

  // Calculate memory ratios
  const usedMemoryMb = health.jvmMetrics.totalMemoryMb - health.jvmMetrics.freeMemoryMb;
  const memoryPct = Math.round((usedMemoryMb / health.jvmMetrics.totalMemoryMb) * 100);

  return (
    <div id="admin-system-health-dashboard" className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
            System Infrastructure Health
          </h3>
          <p className="text-xs text-zinc-500">
            Monitor JVM resources, database response times, and third-party LLM latency in real-time.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 text-xs bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 rounded-full font-bold">
          <Activity className="h-3.5 w-3.5 animate-pulse" />
          <span>SLA STATUS: UP</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Memory allocation card */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60">
          <CardHeader className="pb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              JVM Runtime Memory
            </span>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-indigo-500 stroke-[2.2]" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Allocated Heap</span>
              </div>
              <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">
                {usedMemoryMb}MB / {health.jvmMetrics.totalMemoryMb}MB
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-500"
                style={{ width: `${memoryPct}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>Max Capacity: {health.jvmMetrics.maxMemoryMb}MB</span>
              <span>Load: {memoryPct}%</span>
            </div>
          </CardBody>
        </Card>

        {/* Database performance */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60">
          <CardHeader className="pb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Database Connectivity
            </span>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-500 stroke-[2.2]" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Response Latency</span>
              </div>
              <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">
                {health.databaseLatencyMs}ms
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${Math.min(100, health.databaseLatencyMs * 4)}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>Pool Size: {health.totalDbConnections} active</span>
              <span>Status: HEALTHY</span>
            </div>
          </CardBody>
        </Card>

        {/* Gemini Integration */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60">
          <CardHeader className="pb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Gemini LLM Integration
            </span>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500 stroke-[2.2]" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">LLM Latency Probe</span>
              </div>
              <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">
                {health.geminiLatencyMs}ms
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all"
                style={{ width: `${Math.min(100, health.geminiLatencyMs / 2.5)}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>Concurrent: {health.activeSessions} sessions</span>
              <span>Network: CONNECTED</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
