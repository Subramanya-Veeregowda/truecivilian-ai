import React from "react";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { CustomMiniChart } from "../ui/Feedback";
import { Users, FileCheck2, Award, Zap } from "lucide-react";
import { motion } from "motion/react";

export const CommunityStats: React.FC = () => {
  const chartData = [
    { label: "Potholes & Roads", value: 342, color: "bg-rose-500" },
    { label: "Illegal Garbage Dumping", value: 210, color: "bg-amber-500" },
    { label: "Water Pipeline Leakage", value: 148, color: "bg-emerald-500" },
    { label: "Damaged Streetlights", value: 89, color: "bg-indigo-500" },
  ];

  const highlights = [
    { icon: Users, label: "Active Citizens", value: "24,840+", desc: "Residents submitting daily" },
    { icon: FileCheck2, label: "Total Resolved", value: "94.2%", desc: "Verified resolution index" },
    { icon: Award, label: "Assigned Badges", value: "1,240+", desc: "Civic volunteer milestones" },
    { icon: Zap, label: "Avg Resolution", value: "2.4 Days", desc: "Response time efficiency" },
  ];

  return (
    <section className="py-12 md:py-16 border-t border-zinc-200/40 dark:border-zinc-900/40">
      <div className="space-y-12">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Metrics & Achievements
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white">
            Driven by Real Civic Impact
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            TrueCivilian encourages community engagement with real-time analytics panels, tracking performance and community-led milestones openly.
          </p>
        </div>

        {/* Highlight Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card variant="flat" className="text-center h-full hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors">
                  <CardBody className="space-y-2 p-5 sm:p-6">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-600 dark:text-emerald-400 mx-auto w-10 h-10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-display font-bold text-lg sm:text-2xl text-zinc-900 dark:text-white">
                        {item.value}
                      </p>
                      <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        {item.desc}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Live Diagnostics Graph Container */}
        <div className="max-w-3xl mx-auto">
          <Card variant="default">
            <CardHeader>
              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                  Diagnostics Matrix
                </span>
                <h3 className="font-display font-semibold text-zinc-950 dark:text-white text-base">
                  Civic Resolution Frequency Overview
                </h3>
              </div>
            </CardHeader>
            <CardBody>
              <CustomMiniChart data={chartData} />
            </CardBody>
          </Card>
        </div>

      </div>
    </section>
  );
};
