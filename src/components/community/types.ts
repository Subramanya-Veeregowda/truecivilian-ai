import { Issue } from '../maps/types';

export interface Comment {
  id: string;
  content: string;
  isFlagged: boolean;
  userId: string;
  username: string;
  issueId: string;
  parentId?: string;
  createdAt: string;
}

export interface TrendingHashtag {
  tag: string;
  usageCount: number;
}

export interface Activity {
  id: string;
  type: 'like' | 'comment' | 'verify' | 'share' | 'follow_area' | 'follow_user';
  userId: string;
  userName: string;
  issueId?: string;
  issueTitle?: string;
  detail: string;
  timestamp: string;
}
