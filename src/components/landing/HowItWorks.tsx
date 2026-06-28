import React from "react";
import { Camera, Brain, Map, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      icon: Camera,
      title: "Snap & Upload",
      description: "Take a photo or capture a live video directly at the problem location. Provide an optional brief description.",
    },
    {
      num: "02",
      icon: Brain,
      title: "Gemini Analysis",
      description: "Our AI model checks for duplicates, formats categories, sets the priority rating, and drafts professional titles.",
    },
    {
      num: "03",
      icon: Map,
      title: "Department Dispatched",
      description: "Coordinates are routed immediately to the relevant department queue with optimized street-level worker path planning.",
    },
    {
      num: "04",
      icon: CheckCircle2,
      title: "Resolution Confirmed",
      description: "Receive notifications of progress milestones and see before/after photo evidence comparing completion status.",
    },
  ];

  return (
    <section className="py-12 md:py-16 border-t border-zinc-200/40 dark:border-zinc-900/40">
      <div className="space-y-12">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Process Workflow
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white">
            From Detection to Resolution in 4 Easy Steps
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            TrueCivilian bridges the communication gap between active municipal teams and concerned citizens with structural feedback loops.
          </p>
        </div>

        {/* Step Cards with Connecting Line Visuals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="relative flex flex-col space-y-4 group"
              >
                {/* Number Overlay */}
                <div className="text-5xl font-black font-display text-zinc-100 dark:text-zinc-900/40 select-none leading-none">
                  {step.num}
                </div>

                {/* Card Container */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-semibold text-zinc-900 dark:text-white text-base">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
