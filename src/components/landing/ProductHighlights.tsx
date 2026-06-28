import React from "react";
import { Card, CardBody } from "../ui/Card";
import { Trophy, HelpCircle, Eye, Moon, Compass, CompassIcon } from "lucide-react";
import { motion } from "motion/react";

export const ProductHighlights: React.FC = () => {
  const features = [
    {
      icon: Trophy,
      title: "Gamified Leaderboards",
      description: "Earn points, level up from Citizen to Community Legend, and collect achievements like 'Eco Warrior' or 'Trusted Verifier'.",
      bg: "bg-amber-500/5 hover:border-amber-500/30",
      accent: "text-amber-500",
    },
    {
      icon: Eye,
      title: "Accessibility Guidelines",
      description: "A complete responsive system designed for keyboard navigation, high-contrast modes, large fonts, and visual compliance.",
      bg: "bg-indigo-500/5 hover:border-indigo-500/30",
      accent: "text-indigo-500",
    },
    {
      icon: Moon,
      title: "Dark Mode Ecosystem",
      description: "Seamless automatic color systems styled specifically with eyesafe twilight grays to facilitate low-light outdoor submissions.",
      bg: "bg-purple-500/5 hover:border-purple-500/30",
      accent: "text-purple-500",
    },
  ];

  return (
    <section className="py-12 md:py-16 border-t border-zinc-200/40 dark:border-zinc-900/40">
      <div className="space-y-12">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Platform Capabilities
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white">
            Designed to Go Beyond Traditional Reporting
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            TrueCivilian is designed with extensive accessibility, night-time optimized darkness styles, and deep gamification loops.
          </p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-full"
              >
                <Card variant="flat" className={`h-full border border-zinc-200/50 dark:border-zinc-800/50 transition-all ${item.bg}`}>
                  <CardBody className="space-y-4">
                    <div className={`p-3 w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200/20 dark:border-zinc-800/20 ${item.accent}`}>
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
