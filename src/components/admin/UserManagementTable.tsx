import React, { useState } from "react";
import { Table } from "../ui/Feedback";
import { Button } from "../ui/Button";
import { Shield, ShieldAlert, CheckCircle2, XCircle, Search, Award } from "lucide-react";
import api from "../../lib/api";
import { useNotifications } from "../../context/NotificationContext";

interface User {
  id: string;
  username: string;
  email: string;
  isEnabled: boolean;
  points: number;
  reputationScore: number;
  roles: Array<{ id: string; name: string }>;
}

interface UserManagementTableProps {
  users: User[];
  onRefresh: () => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onRefresh }) => {
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      await api.put(`/admin/users/${userId}/role?role=${newRole}`);
      addNotification("User Role Updated", `Assigned role ${newRole} successfully.`, "success");
      onRefresh();
    } catch (err: any) {
      addNotification("Failed to Update Role", err.response?.data?.message || "An error occurred", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    setUpdatingId(userId);
    try {
      await api.put(`/admin/users/${userId}/status?enabled=${!currentStatus}`);
      addNotification(
        "User Status Updated",
        `User accounts have been successfully ${!currentStatus ? "activated" : "deactivated"}.`,
        "success"
      );
      onRefresh();
    } catch (err: any) {
      addNotification("Failed to Update Status", err.response?.data?.message || "An error occurred", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="admin-user-management-table" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
            System User Management
          </h3>
          <p className="text-xs text-zinc-500">
            Audit system user registries, assign higher role authorities, and govern access state.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-xs bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
        <Table headers={["User Details", "Assigned Role", "Reputation & Points", "Status", "Actions"]}>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-xs text-zinc-400">
                No system accounts matched your lookup terms.
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => {
              const primaryRoleObj = user.roles && user.roles.length > 0 ? user.roles[0] : { name: "CITIZEN" };
              const primaryRole = primaryRoleObj.name.replace("ROLE_", "");
              const isUserEnabled = user.isEnabled !== false;

              return (
                <tr
                  key={user.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors border-b border-zinc-100 dark:border-zinc-900"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center font-bold text-zinc-700 dark:text-zinc-300 text-xs">
                        {user.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-zinc-900 dark:text-white">
                          {user.username}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={primaryRole}
                      disabled={updatingId === user.id}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="text-xs bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="CITIZEN">CITIZEN</option>
                      <option value="VOLUNTEER">VOLUNTEER</option>
                      <option value="AUTHORITY">AUTHORITY</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        <Award className="h-4 w-4 text-emerald-500 stroke-[2.2]" />
                        <span>{user.points} pts</span>
                      </div>
                      <div className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono font-bold text-zinc-500">
                        Score: {user.reputationScore ? user.reputationScore.toFixed(1) : "0.0"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                        isUserEnabled
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400"
                      }`}
                    >
                      {isUserEnabled ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>ACTIVE</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          <span>BLOCKED</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant={isUserEnabled ? "danger" : "success"}
                      size="xs"
                      disabled={updatingId === user.id}
                      onClick={() => handleStatusToggle(user.id, isUserEnabled)}
                    >
                      {isUserEnabled ? "Freeze Account" : "Unfreeze"}
                    </Button>
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
