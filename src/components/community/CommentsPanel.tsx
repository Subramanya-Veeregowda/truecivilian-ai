import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Comment } from './types';
import { ReplyThread } from './ReplyThread';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface CommentsPanelProps {
  issueId: string;
}

export const CommentsPanel: React.FC<CommentsPanelProps> = ({ issueId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/comments/${issueId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        setError('Could not retrieve discussions.');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [issueId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueId,
          content: commentText,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => [...prev, newComment]);
        setCommentText('');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyAdded = (newReply: Comment) => {
    setComments((prev) => [...prev, newReply]);
  };

  // Top level comments are those without parentId
  const topLevelComments = comments.filter((c) => !c.parentId);

  return (
    <div className="border-t border-zinc-100 dark:border-zinc-850 pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
          <MessageSquare className="h-4 w-4 text-emerald-500" />
          <h4 className="font-bold text-xs uppercase tracking-wider">Citizen Discourse ({comments.length})</h4>
        </div>
        <button
          onClick={fetchComments}
          className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          title="Refresh comments"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Write comment input */}
      {user ? (
        <form onSubmit={handlePostComment} className="flex gap-2.5 items-end">
          <div className="flex-1">
            <textarea
              rows={1}
              required
              placeholder="Post a constructive comment on this report..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full text-xs p-3 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-white"
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            className="p-3 rounded-xl shrink-0"
            id={`post-comment-btn-${issueId}`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <p className="text-xs text-zinc-400 italic">Please sign in to join the civic discourse.</p>
      )}

      {/* Error State */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-600 text-xs dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Discussion comments list */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        {loading && comments.length === 0 ? (
          <div className="flex justify-center py-4">
            <span className="text-xs text-zinc-400 animate-pulse">Loading discussion...</span>
          </div>
        ) : topLevelComments.length === 0 ? (
          <p className="text-center py-4 text-xs text-zinc-400">
            No public comments yet. Be the first to start the discussion!
          </p>
        ) : (
          topLevelComments.map((comment) => (
            <div key={comment.id} className="space-y-1">
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{comment.username}</span>
                  <span className="text-[9px] text-zinc-400">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal">{comment.content}</p>
              </div>

              {/* Reply threads nested below */}
              <ReplyThread
                parentId={comment.id}
                allComments={comments}
                onReplyAdded={handleReplyAdded}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
