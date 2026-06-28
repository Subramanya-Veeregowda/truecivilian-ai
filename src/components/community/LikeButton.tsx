import React, { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import { motion } from 'motion/react';

interface LikeButtonProps {
  issueId: string;
  initialLikes: number;
  initialLiked: boolean;
  onLikeToggle?: (newLiked: boolean, newCount: number) => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  issueId,
  initialLikes,
  initialLiked,
  onLikeToggle,
}) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;

    // Optimistic Update
    const nextLiked = !liked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setLiked(nextLiked);
    setLikesCount(nextCount);
    if (onLikeToggle) {
      onLikeToggle(nextLiked, nextCount);
    }

    setIsLiking(true);
    try {
      const response = await fetch(`/api/issues/${issueId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikesCount(data.upvoteCount);
        if (onLikeToggle) {
          onLikeToggle(data.liked, data.upvoteCount);
        }
      } else {
        // Rollback on failure
        setLiked(!nextLiked);
        setLikesCount(likesCount);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      setLiked(!nextLiked);
      setLikesCount(likesCount);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.button
      id={`like-btn-${issueId}`}
      whileTap={{ scale: 0.9 }}
      onClick={handleLike}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
        liked
          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400'
          : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200 hover:text-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-850'
      }`}
    >
      <motion.div
        animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
      </motion.div>
      <span>{likesCount} {likesCount === 1 ? 'Upvote' : 'Upvotes'}</span>
    </motion.button>
  );
};
