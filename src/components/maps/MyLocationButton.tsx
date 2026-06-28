import React from 'react';
import { Navigation, Loader2 } from 'lucide-react';

interface MyLocationButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export const MyLocationButton: React.FC<MyLocationButtonProps> = ({
  onClick,
  loading = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="p-3 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-75 z-30 flex items-center justify-center cursor-pointer"
      title="Recenter on my GPS Location"
    >
      {loading ? (
        <Loader2 className="h-4.5 w-4.5 text-emerald-500 animate-spin" />
      ) : (
        <Navigation className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 rotate-45 fill-emerald-500/10" />
      )}
    </button>
  );
};
