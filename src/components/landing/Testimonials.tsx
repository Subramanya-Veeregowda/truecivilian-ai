import React from "react";
import { Card, CardBody } from "../ui/Card";
import { Quote, Star } from "lucide-react";
import { motion } from "motion/react";

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      quote: "TrueCivilian AI transformed our street safety. We reported a critical water leak next to our child's preschool, and the Water Board dispatched repairs within 24 hours.",
      name: "Meera Krishnan",
      role: "Active Resident",
      avatar: "MK",
    },
    {
      quote: "As a city administrator, sorting duplicate complaints used to take hours. Gemini duplicate detection completely automates ticket triage, letting our engineers get straight to repair work.",
      name: "Officer Suresh Kumar",
      role: "Municipal Authority Desk",
      avatar: "SK",
    },
    {
      quote: "The gamified badge and streak rewards system keep volunteers highly engaged. We regularly coordinate weekend neighborhood cleanup drives using mapped location clusters.",
      name: "Devon Carter",
      role: "Civic Volunteer Leader",
      avatar: "DC",
    },
  ];

  return (
    <section className="py-12 md:py-16 border-t border-zinc-200/40 dark:border-zinc-900/40">
      <div className="space-y-12">
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Citizen Endorsements
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white">
            Endorsed by Communities & City Teams
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Read stories of citizens, volunteers, and public engineers collaborating to rebuild city spaces.
          </p>
        </div>

        {/* Testimonial Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, index) => {
            return (
              <motion.div
                key={rev.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card variant="default" className="h-full relative hover:border-zinc-300 dark:hover:border-zinc-850 transition-colors">
                  <CardBody className="space-y-4 relative">
                    {/* Background Quote Icon */}
                    <Quote className="absolute top-4 right-4 h-10 w-10 text-zinc-100 dark:text-zinc-800/40 pointer-events-none" />

                    {/* Star Rating */}
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 italic leading-relaxed">
                      "{rev.quote}"
                    </p>

                    {/* User Metadata Footer */}
                    <div className="flex items-center space-x-3 pt-2">
                      <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        {rev.avatar}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                          {rev.name}
                        </h4>
                        <p className="text-[10px] text-zinc-400 font-medium">
                          {rev.role}
                        </p>
                      </div>
                    </div>
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
