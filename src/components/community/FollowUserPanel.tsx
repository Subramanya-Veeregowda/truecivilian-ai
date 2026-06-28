import React, { useState } from 'react';
import { UserPlus, UserCheck, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SuggestedUser {
  id: string;
  name: string;
  role: string;
  points: number;
  isFollowing: boolean;
}

export const FollowUserPanel: React.FC = () => {
  const [users, setUsers] = useState<SuggestedUser[]>([
    { id: '11111111-1111-1111-1111-111111111111', name: 'Devon Carter', role: 'Master Volunteer', points: 1240, isFollowing: true },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Ananya Rao', role: 'Sewerage Inspector', points: 940, isFollowing: false },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Elena Rostova', role: 'Civic Citizen', points: 410, isFollowing: false },
  ]);
  const [loading, setLoading] = useState(false);

  const handleToggleFollow = async (userId: string) => {
    try {
      const response = await fetch('/api/follow/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followedId: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isFollowing: data.followed } : u))
        );
      } else {
        // Fallback toggling
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u))
        );
      }
    } catch (err) {
      console.error('Error following user:', err);
      // Fallback
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isFollowing: !u.isFollowing } : u))
      );
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-850">
        <Sparkles className="h-4 w-4 text-emerald-500" />
        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-850 dark:text-zinc-200">
          Citizen Network
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-850">
            <div>
              <span className="font-bold text-xs text-zinc-800 dark:text-zinc-100 block leading-tight">
                {u.name}
              </span>
              <span className="text-[9px] text-zinc-400 font-medium block">
                {u.role} • {u.points} pts
              </span>
            </div>

            <button
              id={`follow-user-btn-${u.id}`}
              onClick={() => handleToggleFollow(u.id)}
              className={`p-1.5 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                u.isFollowing
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : 'bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850'
              }`}
            >
              {u.isFollowing ? (
                <>
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
