import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Check, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';

export const FollowAreaPanel: React.FC = () => {
  const [followingAreas, setFollowingAreas] = useState<string[]>([]);
  const [wardCodeInput, setWardCodeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load starting followed areas from storage or local mock (since we are on a client SPA with a real database but might start fresh)
  useEffect(() => {
    // We can also fetch the user's followed areas if we want, or mock default starting set
    setFollowingAreas(['WARD-102', 'WARD-056']);
  }, []);

  const handleToggleFollow = async (wardCode: string) => {
    if (!wardCode.trim()) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/follow/area', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wardCode: wardCode.toUpperCase(),
          coordinatesJson: '{}',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.followed) {
          setFollowingAreas((prev) => [...prev, wardCode.toUpperCase()]);
        } else {
          setFollowingAreas((prev) => prev.filter((code) => code !== wardCode.toUpperCase()));
        }
        setWardCodeInput('');
      } else {
        // Fallback for safety
        if (followingAreas.includes(wardCode.toUpperCase())) {
          setFollowingAreas((prev) => prev.filter((code) => code !== wardCode.toUpperCase()));
        } else {
          setFollowingAreas((prev) => [...prev, wardCode.toUpperCase()]);
        }
      }
    } catch (err) {
      console.error('Error toggling follow area:', err);
      // Fallback
      if (followingAreas.includes(wardCode.toUpperCase())) {
        setFollowingAreas((prev) => prev.filter((code) => code !== wardCode.toUpperCase()));
      } else {
        setFollowingAreas((prev) => [...prev, wardCode.toUpperCase()]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-850">
        <MapPin className="h-4 w-4 text-emerald-500" />
        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-850 dark:text-zinc-200">
          Subscribed Wards
        </h3>
      </div>

      <div className="space-y-3">
        {/* Follow quick add */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="E.g., WARD-102"
            value={wardCodeInput}
            onChange={(e) => setWardCodeInput(e.target.value)}
            className="flex-1 text-xs px-3 py-2 bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-white uppercase"
          />
          <Button
            onClick={() => handleToggleFollow(wardCodeInput)}
            disabled={isSubmitting || !wardCodeInput.trim()}
            variant="primary"
            className="p-2 text-xs"
            id="follow-area-btn"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Following areas list */}
        <div className="flex flex-wrap gap-2 pt-1">
          {followingAreas.length === 0 ? (
            <p className="text-[11px] text-zinc-400 italic">No subscribed wards yet.</p>
          ) : (
            followingAreas.map((area) => (
              <span
                key={area}
                onClick={() => handleToggleFollow(area)}
                className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl px-2.5 py-1 text-xs font-semibold cursor-pointer transition-all dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/20 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 dark:hover:border-rose-500/20"
                title="Click to unsubscribe"
              >
                <Check className="h-3 w-3 shrink-0" />
                <span>{area}</span>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
