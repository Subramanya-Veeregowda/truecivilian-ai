import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Camera, Check, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface VerificationButtonProps {
  issueId: string;
  latitude: number;
  longitude: number;
  isVerified: boolean;
  onVerifySuccess?: (newVerifyCount: number) => void;
}

export const VerificationButton: React.FC<VerificationButtonProps> = ({
  issueId,
  latitude,
  longitude,
  isVerified,
  onVerifySuccess,
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(true);
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check if current user is authorized to verify (volunteer, authority, admin)
  const isAuthorized = user && ['volunteer', 'authority', 'admin'].includes(user.role.toLowerCase());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/issues/${issueId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueId,
          isApproved,
          verificationNotes: notes,
          latitude,
          longitude,
          onSitePhotoUrl: photoUrl || 'https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&q=80&w=600',
        }),
      });

      if (response.ok) {
        setSuccess(true);
        if (onVerifySuccess) {
          onVerifySuccess(1);
        }
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
          setNotes('');
          setPhotoUrl('');
        }, 1500);
      }
    } catch (err) {
      console.error('Error submitting verification:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {isVerified ? (
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-xs font-semibold dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-500/20">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Community Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-zinc-100 text-zinc-500 border border-zinc-200 rounded-full px-3 py-1 text-xs font-semibold dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
            <span>Awaiting Verification</span>
          </div>
        )}

        {isAuthorized && (
          <button
            id={`verify-btn-trigger-${issueId}`}
            onClick={() => setIsOpen(true)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline underline-offset-2 transition-colors ml-1"
          >
            Verify State
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/60">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-100">
                  <Camera className="h-5 w-5 text-emerald-500" />
                  <h3 className="font-bold text-sm tracking-tight">On-Site Verification</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {success ? (
                <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Check className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Verification Submitted</h4>
                    <p className="text-xs text-zinc-400 mt-1">Thank you for validating this local issue!</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  {/* Approval Choice */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Decision</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsApproved(true)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          isApproved
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve / Real</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsApproved(false)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          !isApproved
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                            : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <span>Reject / False</span>
                      </button>
                    </div>
                  </div>

                  {/* Coordinates Badge */}
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-100 dark:border-zinc-850 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>GPS Sync</span>
                    <span>{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</span>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Verification Notes</label>
                    <textarea
                      required
                      placeholder="Describe what you observed on site. E.g., 'Pothole is 3 inches deep and blocking lane.'"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-3 bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white"
                    />
                  </div>

                  {/* Photo URL */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">On-Site Photo URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="w-full text-xs p-3 bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Confirm'}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
