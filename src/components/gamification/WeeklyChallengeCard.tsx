import React from "react";
import { Zap, Calendar, ShieldCheck, Trophy } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { motion } from "motion/react";

interface ChallengeItem {
  userChallengeId: string;
  challengeId: string;
  title: string;
  description: string;
  challengeType: string;
  targetCount: number;
  progressCount: number;
  rewardPoints: number;
  isCompleted: boolean;
  completedAt: string | null;
  isExpired: boolean;
  endDate: string;
  isReadyToClaim: boolean;
}

interface WeeklyChallengeCardProps {
  challenge: ChallengeItem;
  onClaim: (userChallengeId: string) => void;
  claimingId: string | null;
}

export const WeeklyChallengeCard: React.FC<WeeklyChallengeCardProps> = ({ challenge, onClaim, claimingId }) => {
  const isClaiming = claimingId === challenge.userChallengeId;
  const percentage = Math.min((challenge.progressCount / challenge.targetCount) * 100, 100);

  const getRemainingTime = () => {
    const end = new Date(challenge.endDate);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return "Expired";
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days < 1) return "Ends today";
    return `Ends in ${days}d`;
  };

  return (
    <Card variant="default" className="relative h-full flex flex-col justify-between" id={`weekly-challenge-${challenge.challengeId}`}>
      <CardBody className="p-4 flex flex-col justify-between flex-grow gap-4">
        
        {/* Header Title and Calendar icon */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 rounded-md">
              Weekly Challenge
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <Calendar className="h-3.5 w-3.5" />
              <span>{getRemainingTime()}</span>
            </div>
          </div>
          
          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
            {challenge.title}
          </h3>
          <p className="text-[11px] text-zinc-450 dark:text-zinc-400 leading-normal">
            {challenge.description}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
            <span>Progress Goal</span>
            <span>
              {challenge.progressCount} / {challenge.targetCount}
            </span>
          </div>

          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200/20 dark:border-zinc-750/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>

        {/* Reward actions tag */}
        <div className="flex items-center gap-3 pt-1">
          {/* XP Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
            <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500" />
            <span className="text-xs font-black">+{challenge.rewardPoints} XP</span>
          </div>

          {/* Collect button */}
          <div className="flex-1">
            {challenge.isCompleted ? (
              <Button
                id={`btn-weekly-claimed-${challenge.userChallengeId}`}
                variant="outline"
                size="sm"
                fullWidth
                disabled
                icon={ShieldCheck}
              >
                Claimed
              </Button>
            ) : challenge.isReadyToClaim ? (
              <Button
                id={`btn-weekly-claim-${challenge.userChallengeId}`}
                variant="success"
                size="sm"
                fullWidth
                onClick={() => onClaim(challenge.userChallengeId)}
                isLoading={isClaiming}
                icon={Trophy}
              >
                Claim Reward
              </Button>
            ) : (
              <Button
                id={`btn-weekly-locked-${challenge.userChallengeId}`}
                variant="outline"
                size="sm"
                fullWidth
                disabled
              >
                In Progress
              </Button>
            )}
          </div>
        </div>

      </CardBody>
    </Card>
  );
};
