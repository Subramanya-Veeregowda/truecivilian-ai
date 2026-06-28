import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Clock } from "lucide-react";

interface DepartmentPerf {
  departmentName: string;
  avgResolutionHours: number;
}

interface ResolutionTimeChartProps {
  data: DepartmentPerf[];
  loading?: boolean;
}

export const ResolutionTimeChart: React.FC<ResolutionTimeChartProps> = ({ data, loading = false }) => {
  // Rich preset palettes
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/95 dark:bg-zinc-950/95 border border-zinc-800 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-zinc-100">{payload[0].payload.departmentName}</p>
          <p className="font-extrabold text-emerald-400">
            {payload[0].value.toFixed(1)} hrs
          </p>
          <p className="text-[10px] text-zinc-400">Avg Resolution Latency</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="default" className="h-[400px] flex flex-col" id="card-resolution-time">
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
            <Clock className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Mean Resolution Time</h3>
            <p className="text-xs text-zinc-400">Average duration in hours to resolve issues by unit</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex-1 min-h-0 p-4 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zinc-950/50">
            <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(200,200,200,0.15)" />
              <XAxis 
                type="number" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#888888", fontSize: 11 }} 
              />
              <YAxis 
                dataKey="departmentName" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                width={120}
                tick={{ fill: "#888888", fontSize: 10, fontWeight: 500 }} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(200,200,200,0.05)" }} />
              <Bar 
                dataKey="avgResolutionHours" 
                radius={[0, 8, 8, 0]} 
                barSize={16}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
};
