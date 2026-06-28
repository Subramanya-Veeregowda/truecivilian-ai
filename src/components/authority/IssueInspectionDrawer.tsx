import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { IssueResponse, OfficerWorkloadResponse } from "./types";
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  Briefcase, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Truck,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardHeader, CardBody } from "../ui/Card";

interface IssueInspectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  issue: IssueResponse | null;
  officers: OfficerWorkloadResponse[];
  onAssign: (issueId: string, officerId: string, estCompletion: string) => void;
  onUpdateStatus: (issueId: string, status: string, reason: string) => void;
}

export const IssueInspectionDrawer: React.FC<IssueInspectionDrawerProps> = ({
  isOpen,
  onClose,
  issue,
  officers,
  onAssign,
  onUpdateStatus
}) => {
  const [selectedOfficerId, setSelectedOfficerId] = useState("");
  const [estCompletionDate, setEstCompletionDate] = useState("");
  const [statusReason, setStatusReason] = useState("");

  useEffect(() => {
    if (issue) {
      setSelectedOfficerId(issue.assignedOfficerId || "");
      if (issue.estimatedCompletionDate) {
        setEstCompletionDate(issue.estimatedCompletionDate.split("T")[0]);
      } else {
        // Default to 3 days from now
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 3);
        setEstCompletionDate(defaultDate.toISOString().split("T")[0]);
      }
    }
  }, [issue]);

  if (!issue) return null;

  const handleAssignClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficerId) return;
    onAssign(issue.id, selectedOfficerId, estCompletionDate + "T17:00:00");
  };

  const handleStatusChangeClick = (status: string) => {
    if (!statusReason) {
      alert("Please provide an internal note/reason for status updates.");
      return;
    }
    onUpdateStatus(issue.id, status, statusReason);
    setStatusReason("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 backdrop-blur-xs"
          />

          {/* Slide-out Panel Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between gap-4 shrink-0">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  Issue Inspection
                </span>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white truncate max-w-[320px]">
                  {issue.title}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950/40 dark:hover:bg-zinc-850 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Media Previews */}
              {issue.media && issue.media.length > 0 && (
                <div className="relative rounded-xl overflow-hidden aspect-video bg-zinc-950 flex items-center justify-center border border-zinc-200/20">
                  <img 
                    src={issue.media[0].mediaUrl} 
                    alt={issue.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-3 left-3 bg-zinc-900/90 backdrop-blur border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-zinc-300">
                    REPORT PHOTO EVIDENCE
                  </div>
                </div>
              )}

              {/* Core Details */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-850 text-zinc-500">
                    WARD: {issue.wardCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500">
                    {issue.priority} PRIORITY
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500">
                    {issue.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
                    Incident Description
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950/20 p-3.5 rounded-xl border border-zinc-200/10">
                    {issue.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                  <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>{issue.locationAddress}</span>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950/30 p-4 rounded-xl border border-zinc-200/40 dark:border-zinc-800/20">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Transition Workflow Status
                </h4>
                
                <div className="space-y-2.5">
                  <input
                    type="text"
                    placeholder="Provide internal update log notes..."
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleStatusChangeClick("IN_PROGRESS")}
                    >
                      Set In Progress
                    </Button>
                    <Button
                      variant="danger"
                      size="xs"
                      onClick={() => handleStatusChangeClick("REJECTED")}
                    >
                      Reject Report
                    </Button>
                  </div>
                </div>
              </div>

              {/* Assign Officer Form */}
              <form onSubmit={handleAssignClick} className="space-y-3 bg-zinc-50 dark:bg-zinc-950/30 p-4 rounded-xl border border-zinc-200/40 dark:border-zinc-800/20">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-emerald-500" />
                  Dispatch Assigned Officer
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase font-mono font-bold mb-1">
                      Choose Field Officer
                    </label>
                    <select
                      value={selectedOfficerId}
                      onChange={(e) => setSelectedOfficerId(e.target.value)}
                      required
                      className="w-full text-xs px-2.5 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-none"
                    >
                      <option value="">-- Choose Eligible Officer --</option>
                      {officers.map((off) => (
                        <option key={off.officerId} value={off.officerId}>
                          {off.officerName} (Workload: {off.activeAssignmentsCount})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-400 uppercase font-mono font-bold mb-1">
                      Estimated Completion Date
                    </label>
                    <input
                      type="date"
                      value={estCompletionDate}
                      onChange={(e) => setEstCompletionDate(e.target.value)}
                      required
                      className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="sm" 
                    fullWidth
                    disabled={!selectedOfficerId}
                  >
                    Confirm Officer Dispatch
                  </Button>
                </div>
              </form>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
