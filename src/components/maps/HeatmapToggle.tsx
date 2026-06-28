import React from 'react';
import { Flame, MapPin } from 'lucide-react';

interface HeatmapToggleProps {
  showHeatmap: boolean;
  onToggle: (show: boolean) => void;
}

export const HeatmapToggle: React.FC<HeatmapToggleProps> = ({
  showHeatmap,
  onToggle,
}) => {
  return (
    <div className="flex bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-lg p-1 z-30">
      <button
        onClick={() => onToggle(false)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          !showHeatmap
            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
        }`}
      >
        <MapPin className="h-3.5 w-3.5" />
        <span>Pins</span>
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          showHeatmap
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
        }`}
      >
        <Flame className="h-3.5 w-3.5" />
        <span>Heatmap</span>
      </button>
    </div>
  );
};
