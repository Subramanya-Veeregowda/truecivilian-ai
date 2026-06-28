import React from "react";
import { Card, CardBody } from "../ui/Card";
import { AlertTriangle, Clock, ShieldX, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

export const ProblemStatement: React.FC = () => {
  const bottlenecks = [
    {
      icon: Clock,
      title: "Extremely Slow Resolution",
      description: "Traditional civic systems require days of manual sorting, resulting in unresolved complaints that sit stagnant for months.",
      color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30",
    },
    {
      icon: ShieldX,
      title: "Zero Transparency & Feedback",
      description: "Once citizens file a standard complaint, it enters a visual black hole. There are no status timelines, logs, or updates.",
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
    },
    {
      icon: AlertTriangle,
      title: "Massive Duplicate Backlog",
      description: "Without active duplicate detection filters, municipal agencies receive dozens of identical reports, overloading departments.",
      color: "text-orange-500 bg-orange-50 dark:bg-orange-950/30",
    },
  ];

  return (
    <section className="py-12 md:py-16 border-t border-zinc-200/40 dark:border-zinc-900/40">
      <div className="space-y-12">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
            The Civic Crisis
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white">
            Why Traditional Reporting Is Broken
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Existing government complaint pipelines fail to scale, keeping local authorities and active residents completely disconnected from localized infrastructure issues.
          </p>
        </div>

        {/* Feature Grid with staggering card animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bottlenecks.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card variant="flat" className="h-full hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors">
                  <CardBody className="space-y-4">
                    <div className={`p-3 w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display font-semibold text-base sm:text-lg text-zinc-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
