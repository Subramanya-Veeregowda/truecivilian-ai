import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { IssueResponse } from "./types";
import { Hammer, Sparkles, Image, CheckCircle } from "lucide-react";

interface ResolutionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  issue: IssueResponse | null;
  onConfirmResolve: (issueId: string, notes: string, beforeUrl: string, afterUrl: string) => void;
}

export const ResolutionDialog: React.FC<ResolutionDialogProps> = ({
  isOpen,
  onClose,
  issue,
  onConfirmResolve
}) => {
  const [notes, setNotes] = useState("");
  const [beforeUrl, setBeforeUrl] = useState("");
  const [afterUrl, setAfterUrl] = useState("");

  if (!issue) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes) return;
    onConfirmResolve(
      issue.id,
      notes,
      beforeUrl || "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80",
      afterUrl || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80"
    );
    setNotes("");
    setBeforeUrl("");
    setAfterUrl("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Close Incident & Submit Evidence"
      footerActions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Back
          </Button>
          <Button 
            variant="success" 
            size="sm" 
            onClick={handleSubmit}
            disabled={!notes}
            icon={CheckCircle}
          >
            Confirm Resolution
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Complete the repair details below to mark the incident <strong>{issue.title}</strong> as resolved. This will immediately notify citizens and award verification badges to validating volunteers.
        </p>

        <div>
          <label className="block text-[10px] text-zinc-400 uppercase font-mono font-bold mb-1">
            Resolution & Repair Notes
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe the repairs completed (e.g., filled pothole with asphalt mix, re-paved 3-meter radius)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono font-bold mb-1 flex items-center gap-1">
              <Image className="h-3 w-3" />
              Before Photo URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/before.jpg"
              value={beforeUrl}
              onChange={(e) => setBeforeUrl(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono font-bold mb-1 flex items-center gap-1">
              <Image className="h-3 w-3" />
              After Photo URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/after.jpg"
              value={afterUrl}
              onChange={(e) => setAfterUrl(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
