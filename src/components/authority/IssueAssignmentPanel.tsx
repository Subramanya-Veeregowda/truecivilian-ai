import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { UserPlus, Sparkles, Send, ShieldCheck, Clock } from "lucide-react";
import { OfficerWorkloadResponse, IssueResponse } from "./types";
import { Button } from "../ui/Button";

interface IssueAssignmentPanelProps {
  issues: IssueResponse[];
  officers: OfficerWorkloadResponse[];
  onAssign: (issueId: string, officerId: string, estCompletion: string) => void;
}

export const IssueAssignmentPanel: React.FC<IssueAssignmentPanelProps> = ({
  issues,
  officers,
  onAssign
}) => {
  const [selectedIssueId, setSelectedIssueId] = useState("");
  const [selectedOfficerId, setSelectedOfficerId] = useState("");
  const [estCompletionDate, setEstCompletionDate] = useState("");

  const unassignedIssues = issues.filter(
    (i) => !i.assignedOfficerId && i.status !== "RESOLVED" && i.status !== "CITIZEN_NOTIFIED"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueId || !selectedOfficerId) return;

    const defaultDate = estCompletionDate 
      ? estCompletionDate + "T17:00:00"
      : new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split("T")[0] + "T17:00:00";

    onAssign(selectedIssueId, selectedOfficerId, defaultDate);
    setSelectedIssueId("");
    setSelectedOfficerId("");
    setEstCompletionDate("");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserPlus className="h-4.5 w-4.5 text-emerald-500" />
          <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
            Manual Dispatch & Routing Board
          </h3>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-mono font-bold">
          {unassignedIssues.length} UNASSIGNED
        </span>
      </CardHeader>
      <CardBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono font-bold mb-1">
              Select Open Incident
            </label>
            <select
              value={selectedIssueId}
              onChange={(e) => setSelectedIssueId(e.target.value)}
              required
              className="w-full text-xs px-2.5 py-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-none"
            >
              <option value="">-- Select Incident --</option>
              {unassignedIssues.map((issue) => (
                <option key={issue.id} value={issue.id}>
                  {issue.title} ({issue.wardCode} - {issue.priority})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-zinc-400 uppercase font-mono font-bold mb-1">
              Assign Field Deputy
            </label>
            <select
              value={selectedOfficerId}
              onChange={(e) => setSelectedOfficerId(e.target.value)}
              required
              className="w-full text-xs px-2.5 py-2 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-none"
            >
              <option value="">-- Choose Deputy --</option>
              {officers.map((off) => (
                <option key={off.officerId} value={off.officerId}>
                  {off.officerName} ({off.officerRole} - active: {off.activeAssignmentsCount})
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
              className="w-full text-xs px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-850 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-none"
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="sm" 
            fullWidth
            disabled={!selectedIssueId || !selectedOfficerId}
            icon={Send}
          >
            Dispatch Assignment
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};
