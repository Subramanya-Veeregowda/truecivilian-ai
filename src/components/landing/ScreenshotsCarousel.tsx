import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Button } from "../ui/Button";
import { Layout, Map, Users, BarChart3, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const ScreenshotsCarousel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const slides = [
    {
      title: "Citizen Report Form",
      icon: Layout,
      description: "Interactive report wizard with drag-and-drop attachment uploads, automated GPS capture, and Gemini categorization predictions.",
      mockupType: "form",
    },
    {
      title: "Interactive Geolocation Map",
      icon: Map,
      description: "Google Maps integration displaying status markers (red/yellow/green) with complaints density heatmaps to track local clusters.",
      mockupType: "map",
    },
    {
      title: "Authority Operations Board",
      icon: BarChart3,
      description: "Comprehensive administration control center monitoring response speed, high priority bottlenecks, and employee dispatch schedules.",
      mockupType: "dashboard",
    },
  ];

  const handleNext = () => {
    setActiveTab((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveTab((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="py-12 md:py-16 border-t border-zinc-200/40 dark:border-zinc-900/40">
      <div className="space-y-12">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Platform Mockups
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-zinc-900 dark:text-white">
            Immersive View Interface Previews
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Take a look inside TrueCivilian AI's fully responsive, dark-mode optimized, and beautifully designed user portal.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {slides.map((slide, idx) => {
            const Icon = slide.icon;
            return (
              <button
                key={slide.title}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === idx
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{slide.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Mockup Display Window */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Text Description Pane */}
          <div className="lg:col-span-4 space-y-4 text-center lg:text-left order-2 lg:order-1">
            <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
              {slides[activeTab].title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {slides[activeTab].description}
            </p>
            <div className="flex justify-center lg:justify-start space-x-2.5 pt-2">
              <Button variant="outline" size="sm" onClick={handlePrev} icon={ChevronLeft} />
              <Button variant="outline" size="sm" onClick={handleNext} icon={ChevronRight} />
            </div>
          </div>

          {/* Interactive Screen Container */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
              >
                <Card variant="default" className="shadow-xl border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden h-[340px] sm:h-[400px]">
                  {/* Decorative Frame Header */}
                  <div className="h-10 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200/40 dark:border-zinc-800/50 px-4 flex items-center space-x-1.5 shrink-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-zinc-400 font-mono ml-4 select-none">truecivilian.ai/app/portal</span>
                  </div>

                  {/* Render Mock Views */}
                  <div className="p-6 h-full bg-zinc-50/50 dark:bg-zinc-950/30 overflow-y-auto select-none">
                    {slides[activeTab].mockupType === "form" && (
                      <div className="space-y-4 max-w-md mx-auto">
                        <div className="h-7 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                        <div className="h-16 w-full bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-xs text-zinc-400 border-dashed">
                          Drag and Drop Media Upload File
                        </div>
                        <div className="space-y-2">
                          <div className="h-3 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                          <div className="h-10 w-full bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl" />
                        </div>
                        <div className="h-10 w-full bg-emerald-600 rounded-xl" />
                      </div>
                    )}

                    {slides[activeTab].mockupType === "map" && (
                      <div className="h-full relative rounded-2xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 overflow-hidden flex items-center justify-center text-xs font-semibold text-zinc-400">
                        {/* Map Lines and Grids Mockup */}
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                        <div className="absolute top-1/3 left-1/3 p-2 bg-rose-500 rounded-full text-white shadow-md animate-pulse">
                          <Map className="h-4 w-4" />
                        </div>
                        <div className="absolute top-1/2 left-2/3 p-2 bg-emerald-500 rounded-full text-white shadow-md">
                          <Check className="h-4 w-4" />
                        </div>
                        <span>Interactive Map Grid (Coordinates Map Canvas)</span>
                      </div>
                    )}

                    {slides[activeTab].mockupType === "dashboard" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl space-y-1">
                            <span className="text-[10px] text-zinc-400">Response Rate</span>
                            <p className="text-sm font-bold font-display text-zinc-900 dark:text-white">98.4%</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl space-y-1">
                            <span className="text-[10px] text-zinc-400">Active Handlers</span>
                            <p className="text-sm font-bold font-display text-zinc-900 dark:text-white">42 Officers</p>
                          </div>
                          <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl space-y-1">
                            <span className="text-[10px] text-zinc-400">Avg Resolution</span>
                            <p className="text-sm font-bold font-display text-zinc-900 dark:text-white">2.4 Days</p>
                          </div>
                        </div>
                        <div className="h-28 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl p-4 space-y-2">
                          <div className="h-3 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                          <div className="h-3.5 bg-zinc-100 dark:bg-zinc-850 rounded-md w-full" />
                          <div className="h-3.5 bg-zinc-100 dark:bg-zinc-850 rounded-md w-4/5" />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};
