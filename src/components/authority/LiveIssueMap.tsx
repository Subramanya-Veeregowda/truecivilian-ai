import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Map, MapPin, Layers, Target, Compass, Sliders, ShieldAlert } from "lucide-react";
import { IssueResponse } from "./types";
import { Button } from "../ui/Button";

interface LiveIssueMapProps {
  issues: IssueResponse[];
  onSelectIssue: (issue: IssueResponse) => void;
}

export const LiveIssueMap: React.FC<LiveIssueMapProps> = ({ issues, onSelectIssue }) => {
  const [mapLayer, setMapLayer] = useState<"standard" | "heatmap" | "satellite">("standard");

  // Center coordinate of our city region
  const defaultLat = 12.9715987;
  const defaultLng = 77.5945627;

  // Render status badges with proper colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
      case "CITIZEN_NOTIFIED":
        return "bg-emerald-500";
      case "ASSIGNED":
      case "IN_PROGRESS":
        return "bg-amber-500";
      default:
        return "bg-rose-500";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Map className="h-4.5 w-4.5 text-emerald-500" />
          <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
            Intelligent Live GIS Dispatch Map
          </h3>
        </div>
        <div className="flex gap-1.5 shrink-0">
          {(["standard", "heatmap", "satellite"] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => setMapLayer(layer)}
              className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border transition-colors ${
                mapLayer === layer
                  ? "bg-emerald-600 border-emerald-500 text-white"
                  : "bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200/20 text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardBody className="p-0 h-[400px] relative overflow-hidden flex flex-col lg:flex-row">
        
        {/* Interactive GIS Canvas */}
        <div className="flex-1 bg-zinc-950 text-white relative flex items-center justify-center overflow-hidden">
          {/* Futuristic Radar Grid Background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
          
          {mapLayer === "heatmap" && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15)_0%,transparent_70%)] animate-pulse" />
          )}

          {/* Compass Rose Accent */}
          <div className="absolute bottom-4 right-4 text-zinc-700 font-mono text-[9px] flex items-center gap-1.5 select-none">
            <Compass className="h-4.5 w-4.5 animate-spin-slow" />
            <span>WARD GIS NODE-102</span>
          </div>

          {/* Scale Indicator */}
          <div className="absolute bottom-4 left-4 border-l border-b border-zinc-700 px-2 py-1 font-mono text-[8px] text-zinc-500 select-none">
            Scale: 1 : 12,500
          </div>

          {/* Simulated Spatial Nodes */}
          <div className="absolute inset-0 p-8 flex items-center justify-center">
            {issues.map((issue, idx) => {
              // Convert lat/lng to proportional percentages within a fixed display box
              const baseLat = 12.9;
              const baseLng = 77.5;
              const x = Math.min(90, Math.max(10, ((issue.longitude - baseLng) * 400) % 90));
              const y = Math.min(90, Math.max(10, ((issue.latitude - baseLat) * 400) % 90));

              return (
                <div
                  key={issue.id || idx}
                  className="absolute cursor-pointer group"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => onSelectIssue(issue)}
                >
                  {/* Outer breathing circle */}
                  <div className={`absolute -inset-2 rounded-full opacity-20 animate-ping ${getStatusColor(issue.status)}`} />
                  
                  {/* Core Node Marker */}
                  <div className={`relative h-4 w-4 rounded-full border border-white/40 flex items-center justify-center shadow-lg transition-transform hover:scale-125 ${getStatusColor(issue.status)}`}>
                    <MapPin className="h-2.5 w-2.5 text-white" />
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-zinc-900/95 border border-zinc-700 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap z-50 shadow-xl">
                    <span className="font-bold">{issue.title}</span>
                    <span className="text-[9px] block text-zinc-400 mt-0.5">({issue.status})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Legend / Quick Stats Index */}
        <div className="w-full lg:w-[220px] bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 p-4 font-mono text-[10px] text-zinc-400 flex flex-row lg:flex-col justify-between lg:justify-start gap-4 overflow-y-auto select-none shrink-0">
          <div className="space-y-3.5 flex-1 w-full">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">
              Legend / Incident States
            </span>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                <span>Open Backlog ({issues.filter(i => i.status === "REPORTED" || i.status === "AI_ANALYZED").length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Active Repair ({issues.filter(i => i.status === "ASSIGNED" || i.status === "IN_PROGRESS").length})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Resolved Incident ({issues.filter(i => i.status === "RESOLVED" || i.status === "CITIZEN_NOTIFIED").length})</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 w-full hidden lg:block space-y-2">
            <div className="flex justify-between">
              <span>ACTIVE MARKERS:</span>
              <strong className="text-white">{issues.length}</strong>
            </div>
            <div className="flex justify-between">
              <span>WARD SECTOR:</span>
              <strong className="text-emerald-400">WARD-102</strong>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
