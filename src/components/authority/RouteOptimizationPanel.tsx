import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Navigation, Compass, Landmark, Clock, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { IssueResponse } from "./types";

interface RouteOptimizationPanelProps {
  issues: IssueResponse[];
}

export const RouteOptimizationPanel: React.FC<RouteOptimizationPanelProps> = ({ issues }) => {
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0);

  // Group high priority issues for optimizing routing
  const activeBacklog = issues.filter(
    (i) => i.status !== "RESOLVED" && i.status !== "CITIZEN_NOTIFIED"
  );

  const suggestedRoutes = [
    {
      title: "Priority 1 — Core Safety Route",
      duration: "42 mins",
      distance: "6.8 km",
      stops: activeBacklog.slice(0, 3),
      officer: "Devon Carter",
      vehicle: "Repair Truck 4"
    },
    {
      title: "Priority 2 — Sewage & Sewer Desk",
      duration: "28 mins",
      distance: "4.2 km",
      stops: activeBacklog.filter((i) => i.category?.toLowerCase() === "sewerage" || i.category?.toLowerCase() === "water").slice(0, 2),
      officer: "Ananya Rao",
      vehicle: "Patrol Van 1"
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Navigation className="h-4.5 w-4.5 text-emerald-500" />
          <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
            Automated Field Route Optimization
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[9px] font-bold font-mono">
          <Sparkles className="h-3 w-3 animate-pulse" />
          <span>GEMINI AI OPTIMIZED</span>
        </div>
      </CardHeader>
      <CardBody className="p-6 space-y-6">
        {/* Route Select Tabs */}
        <div className="flex gap-2 border-b border-zinc-100 dark:border-zinc-800/40 pb-3">
          {suggestedRoutes.map((route, idx) => (
            <button
              key={idx}
              onClick={() => setActiveRouteIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                activeRouteIndex === idx
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 shadow-sm"
                  : "bg-transparent border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              Route {idx + 1}
            </button>
          ))}
        </div>

        {/* Selected Route Details */}
        {suggestedRoutes[activeRouteIndex] && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {suggestedRoutes[activeRouteIndex].title}
                </h4>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Assigned Officer: <strong className="text-zinc-600 dark:text-zinc-300">{suggestedRoutes[activeRouteIndex].officer}</strong> ({suggestedRoutes[activeRouteIndex].vehicle})
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                  <Clock className="h-3 w-3" />
                  {suggestedRoutes[activeRouteIndex].duration}
                </span>
                <span className="block text-[9px] text-zinc-400 mt-1 font-mono">
                  Est. {suggestedRoutes[activeRouteIndex].distance} Transit
                </span>
              </div>
            </div>

            {/* Sequence list of stops */}
            <div className="space-y-4">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-mono">
                Optimized Waypoint Sequence
              </span>

              {suggestedRoutes[activeRouteIndex].stops.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-400 font-mono">
                  No active stops in this specific cluster. All cleared!
                </div>
              ) : (
                <div className="relative border-l border-dashed border-zinc-200 dark:border-zinc-800 ml-3.5 pl-6 space-y-5">
                  {suggestedRoutes[activeRouteIndex].stops.map((stop, sIdx) => (
                    <div key={stop.id || sIdx} className="relative group">
                      {/* Waypoint Number Pin */}
                      <div className="absolute -left-[27px] top-0 h-5 w-5 rounded-full bg-zinc-900 border border-zinc-700 text-[10px] font-black text-white flex items-center justify-center font-mono group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-colors">
                        {sIdx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate max-w-[240px]">
                            {stop.title}
                          </h5>
                          <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0 ${
                            stop.priority === "CRITICAL" || stop.priority === "HIGH"
                              ? "bg-rose-500/10 text-rose-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {stop.priority}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 shrink-0 text-zinc-500" />
                          {stop.locationAddress}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
