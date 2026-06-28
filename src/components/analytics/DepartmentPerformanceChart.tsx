import React from "react";
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Award } from "lucide-react";

interface DeptPerformance {
  departmentName: string;
  totalAssigned: number;
  resolvedCount: number;
  slaCompliance: number;
}

interface DepartmentPerformanceChartProps {
  data: DeptPerformance[];
  loading?: boolean;
}

export const DepartmentPerformanceChart: React.FC<DepartmentPerformanceChartProps> = ({ data, loading = false }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/95 dark:bg-zinc-950/95 border border-zinc-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-zinc-100">{payload[0].payload.departmentName}</p>
          <div className="flex justify-between gap-4">
            <span className="text-zinc-400">Assigned:</span>
            <span className="font-bold text-zinc-100">{payload[0].value} issues</span>
          </div>
          {payload[1] && (
            <div className="flex justify-between gap-4">
              <span className="text-zinc-400">SLA Met:</span>
              <span className="font-bold text-emerald-400">{payload[1].value.toFixed(1)}%</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="default" className="h-[400px] flex flex-col" id="card-department-performance">
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <Award className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Department SLA & Workloads</h3>
            <p className="text-xs text-zinc-400">Total assigned complaints compared with SLA compliance</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex-1 min-h-0 p-4 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zinc-950/50">
            <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200,0.15)" />
              <XAxis 
                dataKey="departmentName" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#888888", fontSize: 10, fontWeight: 500 }} 
              />
              <YAxis 
                yAxisId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#888888", fontSize: 11 }}
                label={{ value: 'Assigned Issues', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#888888', fontSize: 10, fontWeight: 500 } }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[50, 100]}
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#888888", fontSize: 11 }}
                label={{ value: 'SLA Compliance (%)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#888888', fontSize: 10, fontWeight: 500 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: 11, fontWeight: 500, color: "#888888" }}
              />
              <Bar 
                yAxisId="left"
                name="Issues Assigned"
                dataKey="totalAssigned" 
                fill="#818cf8" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                name="SLA Compliance Rate"
                dataKey="slaCompliance" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
};
