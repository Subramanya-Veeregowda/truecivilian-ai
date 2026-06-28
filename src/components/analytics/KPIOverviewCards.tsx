import React from "react";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Brain, 
  Users2,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Card, CardBody } from "../ui/Card";

interface KPIData {
  totalReports: number;
  openIssues: number;
  closedIssues: number;
  avgResolutionTimeDays: number;
  departmentSla: number;
  aiAccuracy: number;
  citizenParticipation: number;
}

interface KPIOverviewCardsProps {
  data: KPIData;
  loading?: boolean;
}

export const KPIOverviewCards: React.FC<KPIOverviewCardsProps> = ({ data, loading = false }) => {
  const cards = [
    {
      id: "kpi-total-reports",
      title: "Total Reports Filed",
      value: loading ? "..." : data.totalReports.toLocaleString(),
      change: "+8.4%",
      isPositive: true,
      subtitle: "vs last 30 days",
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
      border: "border-blue-100 dark:border-blue-900/30"
    },
    {
      id: "kpi-open-closed",
      title: "Active Open Issues",
      value: loading ? "..." : data.openIssues.toLocaleString(),
      change: `${data.closedIssues} Resolved`,
      isPositive: true,
      subtitle: "Successfully Closed",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-100 dark:border-emerald-900/30"
    },
    {
      id: "kpi-resolution-time",
      title: "Avg Resolution Time",
      value: loading ? "..." : `${data.avgResolutionTimeDays.toFixed(1)} days`,
      change: "-12.4%",
      isPositive: true, // Lower resolution time is positive!
      subtitle: "faster than target",
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-100 dark:border-amber-900/30"
    },
    {
      id: "kpi-sla-compliance",
      title: "Department SLA",
      value: loading ? "..." : `${data.departmentSla.toFixed(1)}%`,
      change: "+2.1%",
      isPositive: true,
      subtitle: "on-time resolution",
      icon: AlertCircle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "border-rose-100 dark:border-rose-900/30"
    },
    {
      id: "kpi-ai-accuracy",
      title: "AI Triage Accuracy",
      value: loading ? "..." : `${data.aiAccuracy.toFixed(1)}%`,
      change: "+0.3%",
      isPositive: true,
      subtitle: "zero manual lag",
      icon: Brain,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10",
      border: "border-violet-100 dark:border-violet-900/30"
    },
    {
      id: "kpi-citizen-engagement",
      title: "Citizen Engagement",
      value: loading ? "..." : data.citizenParticipation.toLocaleString(),
      change: "+15.8%",
      isPositive: true,
      subtitle: "actions & upvotes",
      icon: Users2,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-500/10",
      border: "border-teal-100 dark:border-teal-900/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <Card key={card.id} variant="default" className={`border-l-4 ${card.border}`} id={card.id}>
            <CardBody className="p-5 flex items-start justify-between">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase block">
                  {card.title}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {card.value}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={`inline-flex items-center gap-0.5 font-bold ${
                    card.isPositive 
                      ? "text-emerald-600 dark:text-emerald-400" 
                      : "text-rose-600 dark:text-rose-400"
                  }`}>
                    {card.isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {card.change}
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500">
                    {card.subtitle}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${card.bg} ${card.color} shrink-0 shadow-inner`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};
