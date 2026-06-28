import React, { useState } from 'react';
import { CornerDownRight, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { Comment } from './types';
import { useAuth } from '../../context/AuthContext';

interface ReplyThreadProps {
  parentId: string;
  allComments: Comment[];
  onReplyAdded: (newReply: Comment) => void;
}

export const ReplyThread: React.FC<ReplyThreadProps> = ({
  parentId,
  allComments,
  onReplyAdded,
}) => {
  const { user } = useAuth();
  const [showInput, setShowInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter replies that belong to this parent comment
  const replies = allComments.filter((c) => c.parentId === parentId);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/comments/${parentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyText,
        }),
      });

      if (response.ok) {
        const newReply = await response.json();
        onReplyAdded(newReply);
        setReplyText('');
        setShowInput(false);
      }
    } catch (err) {
      console.error('Error posting reply:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ml-6 mt-2 pl-4 border-l border-zinc-100 dark:border-zinc-850 space-y-3">
      {/* Existing replies */}
      {replies.map((reply) => (
        <div key={reply.id} className="flex gap-2.5 items-start text-xs">
          <CornerDownRight className="h-3.5 w-3.5 text-zinc-300 mt-1 shrink-0" />
          <div className="bg-zinc-50 dark:bg-zinc-950/20 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-850 flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{reply.username}</span>
              <span className="text-[9px] text-zinc-400">
                {new Date(reply.createdAt).toLocaleDateString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-normal">{reply.content}</p>
          </div>
        </div>
      ))}

      {/* Reply toggle and input form */}
      <div>
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            Reply
          </button>
        ) : (
          <form onSubmit={handlePostReply} className="flex items-center gap-2 mt-1">
            <input
              type="text"
              placeholder="Write a public reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 text-xs px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="p-1.5 rounded-full bg-zinc-100 hover:bg-emerald-500 hover:text-white dark:bg-zinc-800 text-zinc-500 transition-all shrink-0"
            >
              <Send className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setShowInput(false)}
              className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
