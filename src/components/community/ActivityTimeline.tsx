import React, { useState, useEffect } from 'react';
import { Compass, ThumbsUp, MessageSquare, CheckCircle, Share2, MapPin } from 'lucide-react';
import { Activity } from './types';

export const ActivityTimeline: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Generate beautiful real-time mock updates to populate the timeline beautifully
    setActivities([
      {
        id: 'act-1',
        type: 'verify',
        userId: 'v1',
        userName: 'Devon Carter',
        issueTitle: 'Pothole Blockage at Ward 102 Main Crossing',
        detail: 'Approved on-site verification',
        timestamp: '10 mins ago',
      },
      {
        id: 'act-2',
        type: 'comment',
        userId: 'c1',
        userName: 'Elena Rostova',
        issueTitle: 'Water Main Burst',
        detail: 'Dispatched response is underway',
        timestamp: '35 mins ago',
      },
      {
        id: 'act-3',
        type: 'like',
        userId: 'l1',
        userName: 'Ananya Rao',
        issueTitle: 'Broken Power Lines near sector 4',
        detail: 'Upvoted the report priority',
        timestamp: '1 hour ago',
      },
      {
        id: 'act-4',
        type: 'share',
        userId: 's1',
        userName: 'Elena Rostova',
        issueTitle: 'Water Main Burst',
        detail: 'Shared to WhatsApp feed',
        timestamp: '2 hours ago',
      },
    ]);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className="h-3.5 w-3.5 text-indigo-500" />;
      case 'comment':
        return <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />;
      case 'verify':
        return <CheckCircle className="h-3.5 w-3.5 text-teal-500" />;
      case 'share':
        return <Share2 className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <Compass className="h-3.5 w-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-850">
        <Compass className="h-4 w-4 text-emerald-500" />
        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-850 dark:text-zinc-200">
          Activity Matrix
        </h3>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        {activities.map((act) => (
          <div key={act.id} className="flex gap-3 items-start text-xs">
            <div className="h-7 w-7 rounded-lg bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-850 flex items-center justify-center mt-0.5 shrink-0">
              {getIcon(act.type)}
            </div>
            <div className="space-y-0.5 flex-1">
              <p className="text-zinc-650 dark:text-zinc-400 leading-tight">
                <span className="font-bold text-zinc-800 dark:text-zinc-100">{act.userName}</span>{' '}
                {act.detail}
              </p>
              {act.issueTitle && (
                <p className="text-[10px] text-zinc-400 font-medium truncate max-w-[180px]">
                  {act.issueTitle}
                </p>
              )}
              <span className="text-[9px] text-zinc-400 block font-mono">{act.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
