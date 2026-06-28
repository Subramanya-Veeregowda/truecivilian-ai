import React, { useState } from 'react';
import { Route, MapPin, Navigation, Compass, AlertCircle, Clock, Check, Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Issue, OptimizedRoute } from './types';
import api from '../../lib/api';

interface RoutePlannerCardProps {
  issues: Issue[];
  onRouteGenerated: (route: OptimizedRoute | null) => void;
  startLocation: { lat: number; lng: number; address: string };
}

export const RoutePlannerCard: React.FC<RoutePlannerCardProps> = ({
  issues,
  onRouteGenerated,
  startLocation,
}) => {
  const [selectedIssueIds, setSelectedIssueIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState<OptimizedRoute | null>(null);
  const [isDirectionsExpanded, setIsDirectionsExpanded] = useState(false);

  const toggleIssueSelection = (id: string) => {
    setSelectedIssueIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllUnresolved = () => {
    const unresolvedIds = issues
      .filter((i) => i.status !== 'RESOLVED' && i.status !== 'REJECTED')
      .map((i) => i.id);
    setSelectedIssueIds(unresolvedIds);
  };

  const clearSelection = () => {
    setSelectedIssueIds([]);
    setRoute(null);
    onRouteGenerated(null);
  };

  const handleGenerateRoute = async () => {
    if (selectedIssueIds.length === 0) return;

    setLoading(true);
    try {
      const response = await api.get<OptimizedRoute>(`/maps/route`, {
        params: {
          startLat: startLocation.lat,
          startLng: startLocation.lng,
          issueIds: selectedIssueIds.join(','),
        },
      });
      setRoute(response.data);
      onRouteGenerated(response.data);
      setIsDirectionsExpanded(true);
    } catch (err) {
      console.error('Error calculating optimized patrol route:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeUnresolvedIssues = issues.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'REJECTED'
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-2xl shadow-xl overflow-hidden text-xs flex flex-col h-full max-h-[85vh]">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-850 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Route className="h-4.5 w-4.5 text-indigo-500" />
          <span className="font-bold text-zinc-900 dark:text-white tracking-tight">Authority Route Planner</span>
        </div>
        <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold font-mono">
          TSP SOLVER
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Origin summary */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-850 flex gap-2">
          <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-zinc-400 uppercase tracking-wider text-[8px]">Patrol Base / Start Point</p>
            <p className="text-zinc-700 dark:text-zinc-300 font-semibold truncate max-w-[220px]">
              {startLocation.address || 'Device GPS Coordinate'}
            </p>
          </div>
        </div>

        {/* Issue list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-zinc-400 uppercase tracking-wider text-[9px]">Select Incidents ({selectedIssueIds.length} Selected)</span>
            {activeUnresolvedIssues.length > 0 && (
              <button
                onClick={selectAllUnresolved}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Select All Active
              </button>
            )}
          </div>

          {activeUnresolvedIssues.length === 0 ? (
            <div className="p-6 text-center text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
              No active incidents to route.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {activeUnresolvedIssues.map((issue) => {
                const isSelected = selectedIssueIds.includes(issue.id);
                return (
                  <button
                    key={issue.id}
                    onClick={() => toggleIssueSelection(issue.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-500/30'
                        : 'bg-transparent border-zinc-150 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-850/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div
                        className={`h-4.5 w-4.5 rounded-lg border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-zinc-300 dark:border-zinc-700'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{issue.title}</p>
                        <p className="text-[10px] text-zinc-400 truncate font-mono">
                          {issue.category.toUpperCase()} • Severity: {issue.severity}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Metrics overlay if computed */}
        {route && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-850">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-850">
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Estimated Distance</span>
              <span className="text-sm font-black text-zinc-800 dark:text-zinc-100">{route.totalDistanceKm.toFixed(2)} km</span>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-850">
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Patrol Duration</span>
              <span className="text-sm font-black text-zinc-800 dark:text-zinc-100">{route.totalDurationMin.toFixed(0)} mins</span>
            </div>
          </div>
        )}

        {/* Navigation instructions accordion */}
        {route && (
          <div className="border border-zinc-100 dark:border-zinc-850 rounded-xl overflow-hidden">
            <button
              onClick={() => setIsDirectionsExpanded(!isDirectionsExpanded)}
              className="w-full flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 font-bold text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-emerald-500" />
                <span>Patrol Manifest & Directions</span>
              </div>
              {isDirectionsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {isDirectionsExpanded && (
              <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-850 space-y-3 max-h-48 overflow-y-auto">
                {route.navigationInstructions.map((instruction, idx) => (
                  <div key={idx} className="flex gap-2 text-[11px] leading-relaxed">
                    <span className="font-mono text-zinc-400 font-bold">{idx + 1}.</span>
                    <p className="text-zinc-600 dark:text-zinc-400">{instruction}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/50 flex gap-2 shrink-0">
        {route && (
          <button
            onClick={clearSelection}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
          >
            Clear Route
          </button>
        )}
        <button
          onClick={handleGenerateRoute}
          disabled={selectedIssueIds.length === 0 || loading}
          className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Optimizing Waypoints...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>Optimize Dispatch Route</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
