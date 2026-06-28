import React, { useState } from "react";
import { Map, MapPin, Eye, Compass, LayoutGrid } from "lucide-react";
import { Card, CardHeader, CardBody } from "../ui/Card";

interface TopWard {
  ward: string;
  count: number;
}

interface GeographicHeatmapAnalyticsProps {
  wardData: TopWard[];
  loading?: boolean;
}

export const GeographicHeatmapAnalytics: React.FC<GeographicHeatmapAnalyticsProps> = ({ wardData, loading = false }) => {
  const [selectedWardIdx, setSelectedWardIdx] = useState<number | null>(null);

  // Simulated coordinate hotspots on a custom vector SVG map of the city grid
  const mapHotspots = [
    { name: "Ward 12 (Central)", x: 120, y: 110, count: 38, severity: "critical", color: "fill-rose-500" },
    { name: "Ward 8 (North)", x: 180, y: 60, count: 29, severity: "high", color: "fill-orange-500" },
    { name: "Ward 22 (Industrial)", x: 250, y: 150, count: 22, severity: "moderate", color: "fill-amber-500" },
    { name: "Ward 5 (Residential)", x: 70, y: 160, count: 19, severity: "low", color: "fill-emerald-500" },
    { name: "Ward 17 (Metro)", x: 150, y: 220, count: 16, severity: "low", color: "fill-teal-500" }
  ];

  return (
    <Card variant="default" className="h-[400px] flex flex-col" id="card-geographic-heatmap">
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
            <Map className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Municipal Hotspots & Ward Registry</h3>
            <p className="text-xs text-zinc-400">Concentration of municipal complaints by district boundary</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex-1 min-h-0 p-4 flex flex-col sm:flex-row gap-4 relative overflow-y-auto">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zinc-950/50">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Visual Vector Map */}
            <div className="flex-1 min-h-[180px] bg-zinc-50 dark:bg-zinc-800/10 rounded-2xl border border-zinc-150 dark:border-zinc-800/40 relative overflow-hidden flex items-center justify-center p-2">
              <Compass className="absolute top-3 right-3 h-4.5 w-4.5 text-zinc-400 opacity-60 animate-[spin_8s_linear_infinite]" />
              
              <svg viewBox="0 0 300 260" className="w-full max-w-[280px] h-auto drop-shadow-sm">
                {/* Schematic Sector Boundaries */}
                <path d="M 10,130 L 290,130" stroke="rgba(150,150,150,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                <path d="M 150,10 L 150,250" stroke="rgba(150,150,150,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                
                {/* Ward 12 Bounds */}
                <rect x="90" y="80" width="70" height="60" rx="8" className="fill-blue-500/5 stroke-blue-500/15" />
                
                {/* Ward 8 Bounds */}
                <rect x="145" y="30" width="80" height="65" rx="8" className="fill-emerald-500/5 stroke-emerald-500/15" />

                {/* Hotspot Circles */}
                {mapHotspots.map((spot, idx) => {
                  const isSelected = selectedWardIdx === idx;
                  return (
                    <g 
                      key={idx} 
                      className="cursor-pointer group"
                      onClick={() => setSelectedWardIdx(isSelected ? null : idx)}
                    >
                      {/* Pulse ring */}
                      <circle 
                        cx={spot.x} 
                        cy={spot.y} 
                        r={isSelected ? 16 : 8} 
                        className={`stroke-current ${spot.color.replace('fill', 'text')} opacity-40 animate-ping`} 
                      />
                      {/* Core point */}
                      <circle 
                        cx={spot.x} 
                        cy={spot.y} 
                        r={6} 
                        className={`${spot.color} stroke-white dark:stroke-zinc-900 stroke-2 group-hover:scale-125 transition-transform`} 
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Float Overlay Indicator */}
              <div className="absolute bottom-2.5 left-2.5 bg-zinc-900/90 dark:bg-zinc-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-zinc-800 text-[10px] text-zinc-300">
                {selectedWardIdx !== null ? (
                  <p className="font-extrabold text-emerald-400">
                    {mapHotspots[selectedWardIdx].name}: {mapHotspots[selectedWardIdx].count} incidents
                  </p>
                ) : (
                  <p className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5 text-blue-400" />
                    Click map hotspots to inspect
                  </p>
                )}
              </div>
            </div>

            {/* Ward list */}
            <div className="w-full sm:w-[150px] md:w-[180px] shrink-0 flex flex-col justify-between py-1">
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 block">
                Top Active Wards
              </span>
              <div className="space-y-2 flex-1 overflow-y-auto">
                {(wardData.length > 0 ? wardData : mapHotspots).slice(0, 5).map((w, idx) => (
                  <button
                    key={idx}
                    id={`btn-ward-list-${idx}`}
                    onClick={() => setSelectedWardIdx(idx)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all ${
                      selectedWardIdx === idx
                        ? "bg-blue-50/70 border-blue-200 dark:bg-blue-500/10 dark:border-blue-900/40 text-blue-700 dark:text-blue-400"
                        : "bg-white border-zinc-150 dark:bg-zinc-900 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="text-xs font-semibold truncate">
                        {(w as any).ward || w.name}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {w.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};
