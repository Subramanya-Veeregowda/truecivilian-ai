import React from "react";
import { Zap, Clock, ShieldCheck, Trophy, Sparkles } from "lucide-react";
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

interface DailyChallengeCardProps {
  challenge: ChallengeItem;
  onClaim: (userChallengeId: string) => void;
  claimingId: string | null;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({ challenge, onClaim, claimingId }) => {
  const isClaiming = claimingId === challenge.userChallengeId;
  const percentage = Math.min((challenge.progressCount / challenge.targetCount) * 100, 100);

  // Formatted end date details
  const getRemainingTime = () => {
    const end = new Date(challenge.endDate);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return "Expired";
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 1) return "Ends in minutes";
    return `Ends in ${hours}h`;
  };

  return (
    <Card variant="default" className="relative h-full flex flex-col justify-between" id={`daily-challenge-${challenge.challengeId}`}>
      <CardBody className="p-4 flex flex-col justify-between flex-grow gap-4">
        
        {/* Header Title with XP Indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 rounded-md">
              Daily Challenge
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
              <Clock className="h-3.5 w-3.5" />
              <span>{getRemainingTime()}</span>
            </div>
          </div>
          
          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
            {challenge.title}
          </h3>
          <p className="text-[11px] text-zinc-400 leading-normal">
            {challenge.description}
          </p>
        </div>

        {/* Progress statistics */}
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
              className="h-full bg-amber-500 rounded-full"
            />
          </div>
        </div>

        {/* Claim actions wrapper */}
        <div className="flex items-center gap-3 pt-1">
          {/* XP tag */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-500 flex items-center gap-1 shrink-0">
            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-black">+{challenge.rewardPoints} XP</span>
          </div>

          {/* Action button */}
          <div className="flex-1">
            {challenge.isCompleted ? (
              <Button
                id={`btn-claimed-${challenge.userChallengeId}`}
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
                id={`btn-claim-${challenge.userChallengeId}`}
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
                id={`btn-locked-${challenge.userChallengeId}`}
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
