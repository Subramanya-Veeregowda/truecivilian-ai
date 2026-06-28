import React, { useState } from "react";
import { Table } from "../ui/Feedback";
import { Button } from "../ui/Button";
import { IssueResponse } from "./types";
import { Search, SlidersHorizontal, MapPin, Eye, Hammer, RefreshCw } from "lucide-react";

interface IssueQueueTableProps {
  issues: IssueResponse[];
  onInspect: (issue: IssueResponse) => void;
  onResolve: (issue: IssueResponse) => void;
}

export const IssueQueueTable: React.FC<IssueQueueTableProps> = ({ issues, onInspect, onResolve }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Get distinct categories to build dropdown
  const categories = Array.from(new Set(issues.map((i) => i.category).filter(Boolean)));

  // Filter issues based on criteria
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.locationAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.assignedOfficerName && issue.assignedOfficerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = filterCategory === "all" || issue.category?.toLowerCase() === filterCategory.toLowerCase();
    const matchesPriority = filterPriority === "all" || issue.priority?.toLowerCase() === filterPriority.toLowerCase();
    const matchesStatus = filterStatus === "all" || issue.status?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "RESOLVED":
      case "CITIZEN_NOTIFIED":
        return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "ASSIGNED":
      case "IN_PROGRESS":
        return "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "VERIFIED":
        return "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-500/20";
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
      case "HIGH":
        return "text-rose-500 font-bold bg-rose-500/5 border border-rose-500/10";
      case "MEDIUM":
        return "text-amber-500 font-bold bg-amber-500/5 border border-amber-500/10";
      default:
        return "text-zinc-500 font-bold bg-zinc-500/5 border border-zinc-500/10";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/55 dark:border-zinc-800/55 p-4 rounded-2xl shadow-sm">
        <div className="relative w-full md:w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search incident queues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap gap-2.5 w-full md:w-auto items-center justify-end">
          <SlidersHorizontal className="h-4 w-4 text-zinc-400 hidden sm:block shrink-0" />
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="verified">Verified</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Main Datagrid */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl text-zinc-400 font-mono text-xs">
          No matches found for the selected query filters.
        </div>
      ) : (
        <Table headers={["Incident Info", "Priority", "Assigned Officer", "Status", "Actions"]}>
          {filteredIssues.map((issue) => (
            <tr 
              key={issue.id} 
              className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors"
            >
              {/* Info columns */}
              <td className="px-6 py-4.5">
                <div className="space-y-1 max-w-[320px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-md font-mono uppercase tracking-wider">
                      {issue.category || "General"}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {issue.wardCode}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-zinc-400 flex items-center gap-1 truncate">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    {issue.locationAddress}
                  </p>
                </div>
              </td>

              {/* Priority column */}
              <td className="px-6 py-4.5">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${getPriorityBadgeClass(issue.priority)}`}>
                  {issue.priority}
                </span>
              </td>

              {/* Assignee column */}
              <td className="px-6 py-4.5">
                {issue.assignedOfficerName ? (
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      {issue.assignedOfficerName}
                    </span>
                    <span className="block text-[9px] text-zinc-400 font-mono">
                      Est: {issue.estimatedCompletionDate ? new Date(issue.estimatedCompletionDate).toLocaleDateString() : "TBD"}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs italic text-zinc-400">
                    Unassigned
                  </span>
                )}
              </td>

              {/* Status column */}
              <td className="px-6 py-4.5">
                <span className={`px-2.5 py-0.5 text-[10px] rounded-full font-bold border ${getStatusBadgeClass(issue.status)}`}>
                  {issue.status}
                </span>
              </td>

              {/* Action buttons */}
              <td className="px-6 py-4.5">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onInspect(issue)}
                    icon={Eye}
                  >
                    Inspect
                  </Button>
                  {issue.status !== "RESOLVED" && issue.status !== "CITIZEN_NOTIFIED" && (
                    <Button
                      variant="success"
                      size="xs"
                      onClick={() => onResolve(issue)}
                      icon={Hammer}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
};
