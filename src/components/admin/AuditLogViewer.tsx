import React, { useState } from "react";
import { Table } from "../ui/Feedback";
import { Search, Clock, FileText, Globe } from "lucide-react";

interface AuditLog {
  id: string;
  actionName: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  user?: {
    username: string;
  };
}

interface AuditLogViewerProps {
  logs: AuditLog[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(
    (log) =>
      log.actionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user?.username && log.user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div id="admin-audit-log-viewer" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
            Administrative Audit Logs
          </h3>
          <p className="text-xs text-zinc-500">
            Real-time, immutable record of administrative actions, configuration changes, and system activities.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Filter logs by user, action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-xs bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
        <Table headers={["Timestamp", "Operator", "Administrative Action", "Details", "IP Address"]}>
          {filteredLogs.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-xs text-zinc-400">
                No audit activities match your filtration terms.
              </td>
            </tr>
          ) : (
            filteredLogs.map((log) => {
              const operator = log.user?.username || "SYSTEM";
              const date = new Date(log.timestamp);
              const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString();

              return (
                <tr
                  key={log.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors border-b border-zinc-100 dark:border-zinc-900 font-medium"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 font-mono">
                      {operator}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg">
                      <FileText className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{log.actionName}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-zinc-600 dark:text-zinc-300 block max-w-sm overflow-hidden text-ellipsis whitespace-nowrap">
                      {log.details}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                      <Globe className="h-3.5 w-3.5" />
                      <span>{log.ipAddress || "127.0.0.1"}</span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </Table>
      </div>
    </div>
  );
};
