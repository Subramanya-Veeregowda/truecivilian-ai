import React, { useState } from 'react';
import { MessageSquare, MapPin, Calendar, User, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Issue } from '../maps/types';
import { LikeButton } from './LikeButton';
import { VerificationButton } from './VerificationButton';
import { ShareDialog } from './ShareDialog';
import { CommentsPanel } from './CommentsPanel';
import { Card, CardHeader, CardBody, CardFooter } from '../ui/Card';

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localIssue, setLocalIssue] = useState<Issue>(issue);

  const formattedDate = new Date(localIssue.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const mainPhoto = localIssue.media && localIssue.media.length > 0 
    ? localIssue.media[0].mediaUrl 
    : 'https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&q=80&w=600'; // fall back photo

  const handleLikeToggle = (liked: boolean, count: number) => {
    setLocalIssue((prev) => ({
      ...prev,
      upvoteCount: count,
    }));
  };

  const handleVerifySuccess = (increment: number) => {
    setLocalIssue((prev) => ({
      ...prev,
      status: 'VERIFIED',
    }));
  };

  // Helper colors for severity
  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CATASTROPHIC':
        return 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400';
      case 'MAJOR':
        return 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400';
      case 'MODERATE':
        return 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
      default:
        return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400';
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl">
      {/* Upper part with Media if present */}
      <div className="md:flex">
        <div className="md:w-1/3 shrink-0 relative min-h-[160px] max-h-[220px] md:max-h-none overflow-hidden bg-zinc-100 dark:bg-zinc-950">
          <img
            src={mainPhoto}
            alt={localIssue.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-md">
              {localIssue.category.toUpperCase()}
            </span>
            <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded backdrop-blur-md ${getSeverityStyle(localIssue.severity)}`}>
              {localIssue.severity}
            </span>
          </div>
        </div>

        <div className="p-5 md:w-2/3 flex flex-col justify-between space-y-3">
          {/* Header metadata */}
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-mono">
              <Calendar className="h-3 w-3" />
              <span>{formattedDate}</span>
              <span>•</span>
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[150px]">{localIssue.wardCode}</span>
            </div>

            <h3 className="font-display font-bold text-sm md:text-base text-zinc-900 dark:text-white leading-tight">
              {localIssue.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
            {localIssue.description}
          </p>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 bg-zinc-50 dark:bg-zinc-950/20 p-2 rounded-xl border border-zinc-100 dark:border-zinc-850">
            <MapPin className="h-3 w-3 text-emerald-500 shrink-0" />
            <span className="truncate">{localIssue.locationAddress}</span>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <LikeButton
                issueId={localIssue.id}
                initialLikes={localIssue.upvoteCount}
                initialLiked={false}
                onLikeToggle={handleLikeToggle}
              />
              <ShareDialog
                issueId={localIssue.id}
                issueTitle={localIssue.title}
              />
            </div>

            <div className="flex items-center gap-2">
              <VerificationButton
                issueId={localIssue.id}
                latitude={localIssue.latitude}
                longitude={localIssue.longitude}
                isVerified={localIssue.status === 'VERIFIED'}
                onVerifySuccess={handleVerifySuccess}
              />

              <button
                id={`expand-btn-${localIssue.id}`}
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                title={isExpanded ? 'Collapse discussions' : 'Expand discussions'}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded details & comments */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-zinc-100 dark:border-zinc-850 bg-zinc-50/40 dark:bg-zinc-900/10 p-5 space-y-4"
          >
            {/* Additional details block */}
            <div className="grid grid-cols-2 gap-4 text-[11px] font-mono p-3.5 bg-white dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-850 rounded-xl">
              <div>
                <span className="text-zinc-400 block uppercase font-bold text-[9px] mb-0.5">Reporter Identity</span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <User className="h-3 w-3 text-emerald-500" />
                  {localIssue.isAnonymous ? 'Anonymous Citizen' : (localIssue.reporterName || 'Citizen')}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block uppercase font-bold text-[9px] mb-0.5">Triage Queue</span>
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {localIssue.assignedDepartmentName || 'Awaiting Dispatch'}
                </span>
              </div>
            </div>

            {/* Comments discourse */}
            <CommentsPanel issueId={localIssue.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
