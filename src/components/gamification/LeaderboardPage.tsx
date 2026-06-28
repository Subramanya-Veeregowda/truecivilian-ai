import React from "react";
import { Award, Trophy, Users, Star, Crown, Medal } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { useAuth } from "../../context/AuthContext";

interface LeaderboardUser {
  rank: number;
  userId: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  points: number;
  level: number;
  reputationScore: number;
}

interface LeaderboardPageProps {
  entries: LeaderboardUser[];
  loading?: boolean;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ entries = [], loading = false }) => {
  const { user: currentUser } = useAuth();

  // Pick top 3 for podium
  const podium = entries.slice(0, 3);
  const remainder = entries.slice(3);

  const getPodiumStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          border: "border-amber-500 bg-amber-500/[0.03]",
          icon: <Crown className="h-6 w-6 text-amber-500 fill-amber-500 animate-bounce" />,
          avatar: "bg-amber-500 text-white shadow-lg ring-4 ring-amber-500/20",
          text: "text-amber-600 dark:text-amber-400 font-extrabold",
        };
      case 2:
        return {
          border: "border-zinc-300 bg-zinc-300/[0.03] dark:border-zinc-700",
          icon: <Medal className="h-6 w-6 text-zinc-400 fill-zinc-400" />,
          avatar: "bg-zinc-400 text-white shadow-lg ring-4 ring-zinc-400/20",
          text: "text-zinc-500 dark:text-zinc-300 font-bold",
        };
      case 3:
        return {
          border: "border-orange-400 bg-orange-400/[0.03]",
          icon: <Medal className="h-6 w-6 text-orange-400 fill-orange-400" />,
          avatar: "bg-orange-400 text-white shadow-lg ring-4 ring-orange-400/20",
          text: "text-orange-500 dark:text-orange-400 font-bold",
        };
      default:
        return {
          border: "border-zinc-200",
          icon: null,
          avatar: "bg-zinc-200",
          text: "",
        };
    }
  };

  const getUserInitials = (entry: LeaderboardUser) => {
    if (entry.firstName) {
      return `${entry.firstName.charAt(0)}${entry.lastName ? entry.lastName.charAt(0) : ""}`.toUpperCase();
    }
    return entry.username.slice(0, 2).toUpperCase();
  };

  const getUserFullName = (entry: LeaderboardUser) => {
    if (entry.firstName) {
      return `${entry.firstName} ${entry.lastName || ""}`.trim();
    }
    return entry.username;
  };

  return (
    <div className="space-y-6" id="leaderboard-module-root">
      
      {/* Title block */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 rounded-2xl shrink-0">
          <Trophy className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Civic Hall of Fame
          </h3>
          <p className="text-xs text-zinc-455">Platform-wide real-time volunteer ranking of municipal guardians.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <div className="animate-spin h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full" />
          <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Sourcing Honor Registry...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="py-12 text-center text-xs text-zinc-400 border border-dashed rounded-2xl">
          No participants found in the leaderboard.
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Podium block (Top 3 grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Sort podium items so Rank 2 is on left, Rank 1 in middle, Rank 3 on right for desktop feel */}
            {podium.length > 0 && [1, 0, 2].map((idx) => {
              const entry = podium[idx];
              if (!entry) return null;
              const styles = getPodiumStyles(entry.rank);
              const isMe = currentUser?.username === entry.username;

              return (
                <Card
                  key={entry.userId}
                  id={`podium-card-${entry.rank}`}
                  variant="default"
                  className={`border-2 flex flex-col items-center p-5 text-center transition-all hover:scale-[1.01] ${styles.border} ${
                    isMe ? "ring-2 ring-emerald-500/40 border-emerald-500 bg-emerald-500/[0.02]" : ""
                  }`}
                >
                  <div className="space-y-1.5 flex flex-col items-center">
                    {styles.icon}
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Rank {entry.rank}
                    </div>
                  </div>

                  <div className={`h-14 w-14 rounded-full flex items-center justify-center text-sm font-black mt-4 ${styles.avatar}`}>
                    {getUserInitials(entry)}
                  </div>

                  <div className="mt-4 space-y-1">
                    <h4 className="text-xs sm:text-sm font-black text-zinc-850 dark:text-zinc-50 flex items-center gap-1.5 justify-center">
                      <span>{getUserFullName(entry)}</span>
                      {isMe && (
                        <span className="px-1.5 py-0.5 text-[8px] font-black bg-emerald-500 text-white rounded uppercase">
                          YOU
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-zinc-450 dark:text-zinc-400">@{entry.username}</p>
                  </div>

                  {/* Leaderboard points / level highlights */}
                  <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 w-full grid grid-cols-2 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">XP Points</span>
                      <span className={`text-sm font-black ${styles.text}`}>
                        {entry.points}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Level</span>
                      <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">
                        {entry.level}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Remaining list table */}
          {remainder.length > 0 && (
            <Card variant="default">
              <CardBody className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-850 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      <th className="py-3 px-5 text-center">Rank</th>
                      <th className="py-3 px-4">Guardian</th>
                      <th className="py-3 px-4 text-center">Level</th>
                      <th className="py-3 px-4 text-center">Reputation Score</th>
                      <th className="py-3 px-5 text-right">XP Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850/50">
                    {remainder.map((entry) => {
                      const isMe = currentUser?.username === entry.username;
                      return (
                        <tr
                          key={entry.userId}
                          id={`leaderboard-row-${entry.rank}`}
                          className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all ${
                            isMe ? "bg-emerald-500/[0.02] border-l-2 border-emerald-500" : ""
                          }`}
                        >
                          <td className="py-3.5 px-5 text-center font-bold text-xs text-zinc-500">
                            #{entry.rank}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-black text-zinc-500">
                                {getUserInitials(entry)}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-150 flex items-center gap-1.5">
                                  <span>{getUserFullName(entry)}</span>
                                  {isMe && (
                                    <span className="px-1.5 py-0.2 text-[8px] font-black bg-emerald-500 text-white rounded">
                                      YOU
                                    </span>
                                  )}
                                </p>
                                <p className="text-[10px] text-zinc-400">@{entry.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-xs text-zinc-700 dark:text-zinc-300">
                            {entry.level}
                          </td>
                          <td className="py-3.5 px-4 text-center font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                            {entry.reputationScore.toFixed(1)}
                          </td>
                          <td className="py-3.5 px-5 text-right font-black text-xs text-zinc-900 dark:text-zinc-50">
                            {entry.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          )}

        </div>
      )}
    </div>
  );
};
