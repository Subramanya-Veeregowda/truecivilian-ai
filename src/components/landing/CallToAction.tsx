import React from "react";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { ArrowRight, HelpCircle, Mail, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface CallToActionProps {
  onJoin: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onJoin }) => {
  return (
    <section className="py-12 md:py-16 border-t border-zinc-200/40 dark:border-zinc-900/40">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="default" className="relative bg-gradient-to-tr from-zinc-900 via-zinc-950 to-black text-white rounded-3xl p-6 sm:p-10 md:p-12 text-center overflow-hidden border border-white/5 shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Pill Badge */}
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-emerald-400 font-semibold tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>Join TrueCivilian Today</span>
              </div>

              {/* Title Header */}
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight leading-tight">
                Ready to Accelerate Infrastructure Improvements?
              </h2>

              {/* Description body */}
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg mx-auto">
                Whether you want to report active municipal road issues, coordinate local volunteer cleanup blocks, or analyze departmental response speed, TrueCivilian AI makes civic engagement effortless.
              </p>

              {/* Action Button Row */}
              <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3.5">
                <Button
                  size="md"
                  variant="primary"
                  onClick={onJoin}
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-zinc-950 font-bold border-none"
                >
                  Get Early Portal Access
                </Button>
                <button
                  onClick={onJoin}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 text-sm font-semibold rounded-xl text-white transition-all"
                >
                  <Mail className="h-4 w-4" />
                  <span>Subscribe to Newsletters</span>
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
