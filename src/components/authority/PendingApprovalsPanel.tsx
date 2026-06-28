import React from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { AlertCircle, ArrowUpRight, Eye } from "lucide-react";
import { IssueResponse } from "./types";

interface PendingApprovalsPanelProps {
  issues: IssueResponse[];
  onInspect: (issue: IssueResponse) => void;
}

export const PendingApprovalsPanel: React.FC<PendingApprovalsPanelProps> = ({ issues, onInspect }) => {
  const pending = issues.filter(
    (i) => i.status === "REPORTED" || i.status === "AI_ANALYZED"
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 text-amber-500" />
          <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">
            Pending Dispatch Triage
          </h3>
        </div>
        <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded font-mono font-bold">
          {pending.length} NEW REPORT{pending.length !== 1 ? "S" : ""}
        </span>
      </CardHeader>
      <CardBody className="p-6">
        {pending.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 text-xs">
            All reports have been successfully triaged and assigned. Great job!
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((issue) => (
              <div 
                key={issue.id} 
                className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/30 dark:border-zinc-800/20 flex items-center justify-between gap-4 hover:border-zinc-300 dark:hover:border-zinc-800 transition-all group"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase font-mono text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded">
                      {issue.category || "General"}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">
                      {issue.wardCode}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    {issue.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 truncate leading-snug">
                    {issue.description}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="xs" 
                  onClick={() => onInspect(issue)}
                  icon={Eye}
                  className="shrink-0"
                >
                  Triage
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
