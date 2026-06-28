import React, { useState } from 'react';
import { Share2, X, Twitter, Facebook, MessageCircle, Link, Check, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';

interface ShareDialogProps {
  issueId: string;
  issueTitle: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ issueId, issueTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/issues/${issueId}`;

  const handleShareLog = async (platformName: string) => {
    try {
      await fetch(`/api/issues/${issueId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platformName,
          sharedUrl: shareUrl,
        }),
      });
    } catch (err) {
      console.error('Error logging share:', err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    handleShareLog('CopyLink');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlatformShare = (platform: string, href: string) => {
    handleShareLog(platform);
    window.open(href, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const platforms = [
    {
      name: 'X / Twitter',
      icon: Twitter,
      color: 'bg-black text-white dark:bg-zinc-800 dark:border-zinc-700',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`TrueCivilian Report: ${issueTitle}`)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] text-white',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366] text-white',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this local report on TrueCivilian: ${issueTitle} ${shareUrl}`)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-[#0A66C2] text-white',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <>
      <button
        id={`share-btn-trigger-${issueId}`}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-all dark:bg-zinc-900 dark:text-zinc-400 dark:border dark:border-zinc-800 dark:hover:bg-zinc-850"
      >
        <Share2 className="h-3.5 w-3.5" />
        <span>Share</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/60">
                <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Share Civic Incident</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs text-zinc-400 leading-normal">
                  Share this incident on your feeds to help gather support, verify the state, and capture authority attention!
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.name}
                        onClick={() => handlePlatformShare(p.name, p.href)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 border border-zinc-100 dark:border-zinc-800 ${p.color}`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{p.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Direct link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-500 font-mono focus:outline-none"
                    />
                    <Button
                      variant={copied ? 'success' : 'primary'}
                      onClick={copyToClipboard}
                      className="px-4 py-2 shrink-0 text-xs"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
