import React from "react";
import { Card, CardBody } from "../ui/Card";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Inbox, 
  Activity, 
  ShieldAlert 
} from "lucide-react";
import { AuthorityDashboardResponse } from "./types";

interface AuthorityOverviewCardsProps {
  stats: AuthorityDashboardResponse | null;
}

export const AuthorityOverviewCards: React.FC<AuthorityOverviewCardsProps> = ({ stats }) => {
  if (!stats) return null;

  const cardData = [
    {
      label: "Total Assigned Issues",
      value: stats.totalAssigned,
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "hover:border-blue-500/30",
      description: "Directly dispatched to officers"
    },
    {
      label: "Open Backlog",
      value: stats.openIssues,
      icon: Inbox,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "hover:border-amber-500/30",
      description: "Awaiting final resolution"
    },
    {
      label: "Urgent Priority Cases",
      value: stats.urgentIssues,
      icon: ShieldAlert,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "hover:border-rose-500/30",
      description: "SLA-critical & safety risks"
    },
    {
      label: "Resolved Incidents",
      value: stats.resolvedIssues,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "hover:border-emerald-500/30",
      description: "Successfully repaired & closed"
    },
    {
      label: "Avg Resolution Velocity",
      value: `${stats.avgResolutionTimeDays} days`,
      icon: Clock,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "hover:border-indigo-500/30",
      description: "Target SLA is < 4 days"
    },
    {
      label: "Pending Verification",
      value: stats.pendingApprovals,
      icon: AlertTriangle,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      borderColor: "hover:border-violet-500/30",
      description: "Requires initial on-site review"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cardData.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card 
            key={idx} 
            variant="flat" 
            className={`border border-zinc-200/50 dark:border-zinc-800/40 ${card.borderColor} transition-colors`}
          >
            <CardBody className="p-4 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg ${card.bgColor} ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {card.value}
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                  {card.description}
                </p>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};
