import React from "react";
import { motion } from "motion/react";
import { Button } from "../ui/Button";
import { Sparkles, MapPin, ArrowRight, Play } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onWatchVideo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onWatchVideo }) => {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: "8s" }} />

      <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-8 px-4">
        {/* Animated Pill Tag */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-900/30 text-xs font-semibold tracking-wider uppercase font-mono"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>TrueCivilian AI v1.0 Launching Globally</span>
        </motion.div>

        {/* Catchy Header Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-zinc-900 dark:text-white leading-none"
        >
          Empowering Communities <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
            Through AI-Driven Civic Action
          </span>
        </motion.h1>

        {/* Captivating Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-sans text-sm sm:text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
        >
          Report local community issues like potholes, damaged streetlights, and illegal dumping in seconds. Powered by Google Gemini AI, TrueCivilian routes reports instantly to relevant departments, verifies duplicates, and tracks resolution openly.
        </motion.p>

        {/* Action Callouts */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-3.5"
        >
          <Button
            size="lg"
            variant="primary"
            onClick={onGetStarted}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full sm:w-auto shadow-lg shadow-emerald-500/20 dark:shadow-emerald-500/10"
          >
            Launch Citizen Portal
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={onWatchVideo}
            icon={Play}
            className="w-full sm:w-auto"
          >
            Watch Demo Video
          </Button>
        </motion.div>

        {/* Integrated Real-time Stat Map Pin Callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-6 flex justify-center"
        >
          <div className="inline-flex items-center space-x-2.5 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 px-4 py-2.5 rounded-2xl text-xs text-zinc-600 dark:text-zinc-400" id="live-pins">
            <MapPin className="h-4 w-4 text-rose-500 animate-bounce" />
            <span>Over <strong>1,420 resolved issues</strong> tracked this week across major urban sectors</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
