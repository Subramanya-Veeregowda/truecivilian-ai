import React from 'react';
import { X, Calendar, User, Building, AlertTriangle, Shield, CheckCircle, Clock, ExternalLink, ThumbsUp, MapPin } from 'lucide-react';
import { Issue } from './types';
import { motion } from 'motion/react';

interface IssueDetailsBottomSheetProps {
  issue: Issue | null;
  onClose: () => void;
}

export const IssueDetailsBottomSheet: React.FC<IssueDetailsBottomSheetProps> = ({
  issue,
  onClose,
}) => {
  if (!issue) return null;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'REPORTED':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-500/25';
      case 'VERIFIED':
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/25';
      case 'IN_PROGRESS':
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-500/25 animate-pulse';
      case 'RESOLVED':
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
      default:
        return 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200/50';
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CATASTROPHIC':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25 font-bold';
      case 'MAJOR':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25';
      case 'MODERATE':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border-zinc-200/60';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25 font-bold';
      case 'HIGH':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25';
      default:
        return 'bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border-zinc-200/60';
    }
  };

  const displayReporterName = issue.isAnonymous
    ? 'Anonymous Citizen'
    : issue.reporterName || 'TrueCivilian Reporter';

  const formattedDate = new Date(issue.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const mediaUrl = issue.media && issue.media.length > 0 ? issue.media[0].mediaUrl : '';

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      className="fixed md:absolute bottom-0 left-0 right-0 md:left-auto md:right-4 md:top-4 md:bottom-4 md:w-96 bg-white dark:bg-zinc-900 border-t md:border border-zinc-200/50 dark:border-zinc-800/80 rounded-t-3xl md:rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh] md:max-h-none text-xs"
    >
      {/* Visual Header image if available */}
      {mediaUrl ? (
        <div className="relative h-44 shrink-0 bg-zinc-950">
          <img
            src={mediaUrl}
            alt={issue.title}
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-950/60 hover:bg-zinc-950/80 text-white backdrop-blur-sm transition-colors border border-white/10"
          >
            <X className="h-4.5 w-4.5" />
          </button>
          <div className="absolute bottom-3 left-4 right-4">
            <span className="text-[10px] bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded font-bold font-mono tracking-wider uppercase">
              {issue.category.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-850 flex items-center justify-between shrink-0 bg-zinc-50 dark:bg-zinc-950/40">
          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold font-mono tracking-wider uppercase">
            {issue.category.replace(/_/g, ' ')}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      {/* Main details body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div>
          <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white leading-snug">
            {issue.title}
          </h3>
          <p className="text-zinc-400 font-mono text-[9px] mt-1.5 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-rose-500" />
            <span>{issue.locationAddress}</span>
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getStatusStyle(issue.status)}`}>
            STATUS: {issue.status.replace(/_/g, ' ')}
          </span>
          <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getSeverityStyle(issue.severity)}`}>
            {issue.severity} IMPACT
          </span>
          <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getPriorityStyle(issue.priority)}`}>
            {issue.priority} PRIORITY
          </span>
        </div>

        {/* AI Description Panel */}
        <div className="bg-zinc-50 dark:bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-850 space-y-2">
          <p className="font-bold text-zinc-400 uppercase tracking-wider text-[8px] font-mono">Incident Synthesis</p>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs">
            {issue.description || 'No detailed analysis has been provided for this civic hazard.'}
          </p>
        </div>

        {/* Tags */}
        {issue.hashtags && issue.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {issue.hashtags.map((tag) => (
              <span key={tag} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded font-mono text-[10px]">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata fields */}
        <div className="border-t border-zinc-150 dark:border-zinc-800/80 pt-4 space-y-2.5">
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
            <div>
              <p className="text-[10px] text-zinc-400 leading-none">Report Date & Time</p>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <User className="h-4 w-4 text-zinc-400 shrink-0" />
            <div>
              <p className="text-[10px] text-zinc-400 leading-none">Reporter Identity</p>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">{displayReporterName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <Building className="h-4 w-4 text-zinc-400 shrink-0" />
            <div>
              <p className="text-[10px] text-zinc-400 leading-none">Assigned Department</p>
              <p className="font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                {issue.assignedDepartmentName || 'Pending Triage Dispatch'}
              </p>
            </div>
          </div>
        </div>

        {/* Support feedback counters */}
        <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-800/80 pt-4 text-[10px] font-bold text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="h-4 w-4 text-emerald-500" />
            <span>{issue.upvoteCount} Endorsements</span>
          </div>
          <span>Ward {issue.wardCode || '102'}</span>
        </div>
      </div>
    </motion.div>
  );
};
