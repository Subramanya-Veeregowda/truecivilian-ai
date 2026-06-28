import React from "react";
import { Users, AlertTriangle, Building2, Layers, Cpu, Database } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { motion } from "motion/react";

interface SystemOverviewCardsProps {
  stats: {
    totalUsers: number;
    totalIssues: number;
    totalDepartments: number;
    totalCategories: number;
    systemUptimeRatio: number;
    databaseLatencyAvg: number;
    openIssues: number;
    resolvedIssues: number;
  } | null;
}

export const SystemOverviewCards: React.FC<SystemOverviewCardsProps> = ({ stats }) => {
  if (!stats) return null;

  const cardData = [
    {
      title: "Total Registered Users",
      value: stats.totalUsers.toLocaleString(),
      subtitle: "Citizens, Volunteers, Staff",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Active Civic Issues",
      value: stats.totalIssues.toLocaleString(),
      subtitle: `${stats.openIssues} Open, ${stats.resolvedIssues} Resolved`,
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Registered Departments",
      value: stats.totalDepartments.toLocaleString(),
      subtitle: "Municipal operational branches",
      icon: Building2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Civic Categories",
      value: stats.totalCategories.toLocaleString(),
      subtitle: "Pre-configured classification classes",
      icon: Layers,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "System SLA Ratio",
      value: `${stats.systemUptimeRatio}%`,
      subtitle: "Continuous live runtime uptime",
      icon: Cpu,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
    {
      title: "Database Latency",
      value: `${stats.databaseLatencyAvg}ms`,
      subtitle: "Average query roundtrip timing",
      icon: Database,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div id="admin-system-overview-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-all border border-zinc-200/60 dark:border-zinc-800/60">
              <CardBody className="p-6 flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className="text-3xl font-black text-zinc-900 dark:text-white">
                    {card.value}
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block font-medium">
                    {card.subtitle}
                  </span>
                </div>
                <div className={`p-4 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6 stroke-[2.2]" />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
