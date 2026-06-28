import React, { useEffect, useState } from 'react';
import { MapPin, AlertTriangle, ChevronRight, Compass, ShieldAlert, Loader2 } from 'lucide-react';
import { Issue } from './types';
import api from '../../lib/api';

interface NearbyIssuesPanelProps {
  centerLat: number;
  centerLng: number;
  onSelectIssue: (issue: Issue) => void;
  selectedIssueId?: string;
}

export const NearbyIssuesPanel: React.FC<NearbyIssuesPanelProps> = ({
  centerLat,
  centerLng,
  onSelectIssue,
  selectedIssueId,
}) => {
  const [nearby, setNearby] = useState<{ issue: Issue; distanceKm: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNearby = async () => {
      setLoading(true);
      try {
        const response = await api.get<{ issue: Issue; distanceKm: number }[]>(`/maps/nearby`, {
          params: {
            latitude: centerLat,
            longitude: centerLng,
            radius: 15.0, // search within 15 km
          },
        });
        setNearby(response.data);
      } catch (err) {
        console.error('Error fetching nearby issues:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [centerLat, centerLng]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REPORTED':
        return 'bg-blue-500';
      case 'VERIFIED':
        return 'bg-emerald-500';
      case 'IN_PROGRESS':
        return 'bg-amber-500';
      case 'RESOLVED':
        return 'bg-zinc-400';
      default:
        return 'bg-zinc-300';
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-2xl shadow-xl overflow-hidden text-xs flex flex-col h-full max-h-[85vh]">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-850 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Compass className="h-4.5 w-4.5 text-emerald-500" />
          <span className="font-bold text-zinc-900 dark:text-white tracking-tight">Nearby Community Feeds</span>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold font-mono">
          {nearby.length} INCIDENTS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
            <span className="font-mono text-[10px]">Syncing local coordinates...</span>
          </div>
        ) : nearby.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 space-y-2">
            <ShieldAlert className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-700" />
            <p className="font-medium text-xs">No active hazards nearby</p>
            <p className="text-[10px] text-zinc-400 leading-normal">Drag or search the map to find reports in other sectors.</p>
          </div>
        ) : (
          nearby.map(({ issue, distanceKm }) => {
            const isSelected = selectedIssueId === issue.id;
            return (
              <button
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-50 dark:bg-zinc-950/80 border-emerald-500/30 shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-850/30'
                }`}
              >
                <div className="flex gap-3 min-w-0 pr-2">
                  <div className="relative shrink-0 mt-0.5">
                    <span className={`absolute top-0.5 left-0.5 h-2 w-2 rounded-full ${getStatusColor(issue.status)}`} />
                    <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200/40 dark:border-zinc-700/40">
                      <MapPin className="h-4.5 w-4.5 text-zinc-500" />
                    </div>
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{issue.title}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{issue.locationAddress}</p>
                    <p className="text-[9px] text-zinc-400 font-mono flex items-center gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{distanceKm.toFixed(2)} km away</span>
                      <span>•</span>
                      <span>{issue.category.toUpperCase()}</span>
                    </p>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? 'text-emerald-500 translate-x-0.5' : 'text-zinc-300 dark:text-zinc-700'}`} />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
