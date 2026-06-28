import React, { useState, useEffect } from 'react';
import { Hash, TrendingUp } from 'lucide-react';
import { TrendingHashtag } from './types';

interface TrendingHashtagsProps {
  onHashtagSelect?: (tag: string | null) => void;
  selectedHashtag?: string | null;
}

export const TrendingHashtags: React.FC<TrendingHashtagsProps> = ({
  onHashtagSelect,
  selectedHashtag,
}) => {
  const [hashtags, setHashtags] = useState<TrendingHashtag[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHashtags = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/trending/hashtags');
        if (response.ok) {
          const data = await response.json();
          setHashtags(data);
        } else {
          // Fallback mock data if server list is empty or seeding is still in progress
          setHashtags([
            { tag: 'CleanWard102', usageCount: 42 },
            { tag: 'PotholeAlert', usageCount: 28 },
            { tag: 'WaterLeaks', usageCount: 19 },
            { tag: 'CivicPride', usageCount: 15 },
            { tag: 'SafeStreets', usageCount: 12 },
          ]);
        }
      } catch (err) {
        console.error('Error fetching trending hashtags:', err);
        setHashtags([
          { tag: 'CleanWard102', usageCount: 42 },
          { tag: 'PotholeAlert', usageCount: 28 },
          { tag: 'WaterLeaks', usageCount: 19 },
          { tag: 'CivicPride', usageCount: 15 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHashtags();
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-850">
        <TrendingUp className="h-4 w-4 text-emerald-500" />
        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-850 dark:text-zinc-200">
          Trending Municipal Tags
        </h3>
      </div>

      {loading && hashtags.length === 0 ? (
        <p className="text-xs text-zinc-400 animate-pulse">Calculating tag weight...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {hashtags.map((h) => {
            const isActive = selectedHashtag === h.tag;
            return (
              <button
                key={h.tag}
                onClick={() => onHashtagSelect && onHashtagSelect(isActive ? null : h.tag)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Hash className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                  <span>#{h.tag}</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500'}`}>
                  {h.usageCount}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
