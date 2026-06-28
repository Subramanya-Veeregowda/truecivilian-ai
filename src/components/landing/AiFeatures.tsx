import React from "react";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Sparkles, Brain, CheckSquare, Layers, HelpCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export const AiFeatures: React.FC = () => {
  const aiCapabilities = [
    {
      icon: Brain,
      title: "Multimodal Categorization",
      description: "Instantly reads photo or video attachments to classify issues into exact categories (Road, Garbage, Pollution, Traffic) automatically.",
      tag: "Gemini 1.5 Flash",
    },
    {
      icon: Layers,
      title: "Automatic Severity & Department Routing",
      description: "Evaluates visual impact variables to predict urgency, assign priority, and route reports directly to designated department queues.",
      tag: "Intelligent Triage",
    },
    {
      icon: CheckSquare,
      title: "Active Duplicate Detection",
      description: "Informs citizens of nearby open reports matching their active submission details to reduce backlog noise and consolidate support.",
      tag: "Spatial Analysis",
    },
  ];

  return (
    <section className="py-12 md:py-16 border-t border-zinc-200/40 dark:border-zinc-900/40 relative">
      {/* Absolute floating ambient dot */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="space-y-12">
        {/* Title Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Google Gemini Powered</span>
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white leading-tight">
              AI Engines Optimized for Municipal Diagnostics
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              TrueCivilian bypasses manual municipal dispatch pipelines entirely. By training system-specific schema prompt boundaries, civic reports are parsed, evaluated, and classified within milliseconds.
            </p>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiCapabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card variant="default" className="h-full hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300">
                  <CardHeader>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/45 px-2 py-1 rounded-md">
                      {item.tag}
                    </span>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 w-12 h-12 rounded-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300">
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
