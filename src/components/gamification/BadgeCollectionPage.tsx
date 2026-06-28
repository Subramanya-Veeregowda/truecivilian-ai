import React from "react";
import { Lock, Award, CheckCircle2, Star } from "lucide-react";
import { Card, CardBody } from "../ui/Card";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  badgeType: string;
  pointsRequired: number;
}

interface UserBadge {
  id: string;
  awardedAt: string;
  badge: BadgeItem;
}

interface BadgeCollectionPageProps {
  allBadges: BadgeItem[];
  userBadges: UserBadge[];
  loading?: boolean;
}

export const BadgeCollectionPage: React.FC<BadgeCollectionPageProps> = ({
  allBadges = [],
  userBadges = [],
  loading = false,
}) => {
  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badge.id));

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "lucide-eye":
        return <Award className="h-6 w-6 text-amber-500" />;
      case "lucide-check-circle":
        return <Award className="h-6 w-6 text-blue-500" />;
      case "lucide-zap":
        return <Award className="h-6 w-6 text-emerald-500" />;
      case "lucide-leaf":
        return <Award className="h-6 w-6 text-teal-500" />;
      case "lucide-shield-check":
        return <Award className="h-6 w-6 text-purple-500" />;
      default:
        return <Award className="h-6 w-6 text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-4" id="badge-collection-root">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
          Community Badge Case
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">Showcase of official civic honors and unlockable milestones.</p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      ) : allBadges.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-400 border border-dashed rounded-2xl">
          No badges registered in the database.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {allBadges.map((badge) => {
            const isEarned = earnedBadgeIds.has(badge.id);
            return (
              <Card
                key={badge.id}
                id={`badge-card-${badge.id}`}
                variant="default"
                className={`relative overflow-hidden transition-all duration-300 border ${
                  isEarned
                    ? "bg-amber-500/[0.02] border-amber-500/20 shadow-sm"
                    : "bg-zinc-50/50 dark:bg-zinc-900/10 border-zinc-200/40 dark:border-zinc-800/40 opacity-75"
                }`}
              >
                {/* Visual lock status tags */}
                {isEarned ? (
                  <div className="absolute top-2.5 right-2.5 p-1 bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="absolute top-2.5 right-2.5 p-1 bg-zinc-100 text-zinc-400 dark:bg-zinc-800 rounded-lg">
                    <Lock className="h-4 w-4" />
                  </div>
                )}

                <CardBody className="p-4.5 flex items-start gap-4">
                  {/* Badge visual badge icon */}
                  <div className={`p-3.5 rounded-2xl shrink-0 ${
                    isEarned
                      ? "bg-amber-500/10 dark:bg-amber-500/15 ring-2 ring-amber-500/20"
                      : "bg-zinc-100 dark:bg-zinc-800 grayscale"
                  }`}>
                    {getBadgeIcon(badge.iconUrl)}
                  </div>

                  {/* Name and description text details */}
                  <div className="space-y-1.5 min-w-0 pr-4">
                    <h4 className={`text-xs sm:text-sm font-black truncate ${
                      isEarned ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-450 dark:text-zinc-400"
                    }`}>
                      {badge.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2">
                      {badge.description}
                    </p>
                    
                    {/* Progression / points marker */}
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                      <Star className={`h-3 w-3 ${isEarned ? "text-amber-400 fill-amber-400" : ""}`} />
                      Requires: {badge.pointsRequired} XP
                    </span>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
