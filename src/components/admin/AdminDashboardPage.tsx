import React, { useState, useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import api from "../../lib/api";

import { SystemOverviewCards } from "./SystemOverviewCards";
import { UserManagementTable } from "./UserManagementTable";
import { DepartmentManagementPanel } from "./DepartmentManagementPanel";
import { CategoryManagementPanel } from "./CategoryManagementPanel";
import { AIConfigurationPanel } from "./AIConfigurationPanel";
import { PromptManagementPanel } from "./PromptManagementPanel";
import { AuditLogViewer } from "./AuditLogViewer";
import { SystemHealthDashboard } from "./SystemHealthDashboard";
import { APIUsageDashboard } from "./APIUsageDashboard";
import { RoleManagementPanel } from "./RoleManagementPanel";
import { AnnouncementManager } from "./AnnouncementManager";
import { FeatureFlagPanel } from "./FeatureFlagPanel";
import { PlatformSettingsPage } from "./PlatformSettingsPage";

import { 
  BarChart3, 
  Users, 
  Building2, 
  Layers, 
  Cpu, 
  Flag, 
  Megaphone, 
  Settings, 
  ScrollText,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const AdminDashboardPage: React.FC = () => {
  const { addNotification } = useNotifications();
  const [activeSubTab, setActiveSubTab] = useState("overview");

  // State caches
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllAdminData = async () => {
    try {
      const [dashRes, usersRes, deptsRes, catsRes, logsRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/departments"),
        api.get("/admin/categories"),
        api.get("/admin/audit-logs"),
      ]);

      setDashboardData(dashRes.data);
      setUsers(usersRes.data);
      setDepartments(deptsRes.data);
      setCategories(catsRes.data);
      setAuditLogs(logsRes.data);
    } catch (err: any) {
      console.error("Failed to fetch superadmin datasets:", err);
      addNotification("Sync Error", "Unable to load real-time superadmin registries.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="h-8 w-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider">
          Connecting to Admin Secure Gateway...
        </p>
      </div>
    );
  }

  const tabItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "categories", label: "Categories", icon: Layers },
    { id: "ai", label: "AI Config", icon: Cpu },
    { id: "flags", label: "Feature Flags", icon: Flag },
    { id: "broadcasts", label: "Broadcasts", icon: Megaphone },
    { id: "settings", label: "Variables", icon: Settings },
    { id: "audit", label: "Audit Log", icon: ScrollText },
  ];

  const currentSettings = dashboardData?.activeFlags || [];

  return (
    <div id="admin-dashboard-page" className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500 stroke-[2.2]" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest font-mono">
              SECURITY STATE: ENCRYPTED
            </span>
          </div>
          <h2 className="font-display font-black text-zinc-900 dark:text-white text-2xl tracking-tight">
            TrueCivilian AI Super Administration Suite
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Platform governance console for coordinating municipal intelligence pipelines and supervising Ward registers.
          </p>
        </div>
      </div>

      {/* Tabs Menu bar */}
      <div className="overflow-x-auto pb-1 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex gap-1.5 min-w-max">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950 shadow-sm"
                    : "bg-zinc-50 border-zinc-200/60 text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900/40 dark:border-zinc-800/60 dark:text-zinc-400 dark:hover:bg-zinc-850"
                }`}
              >
                <Icon className="h-4 w-4 stroke-[2]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Component Panels */}
      <div className="pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeSubTab === "overview" && (
              <div className="space-y-10">
                <SystemOverviewCards stats={dashboardData} />
                <SystemHealthDashboard />
                <APIUsageDashboard />
              </div>
            )}

            {activeSubTab === "users" && (
              <div className="space-y-10">
                <UserManagementTable users={users} onRefresh={fetchAllAdminData} />
                <RoleManagementPanel users={users} />
              </div>
            )}

            {activeSubTab === "departments" && (
              <DepartmentManagementPanel departments={departments} onRefresh={fetchAllAdminData} />
            )}

            {activeSubTab === "categories" && (
              <CategoryManagementPanel categories={categories} onRefresh={fetchAllAdminData} />
            )}

            {activeSubTab === "ai" && (
              <div className="space-y-10">
                <AIConfigurationPanel settings={currentSettings} onRefresh={fetchAllAdminData} />
                <PromptManagementPanel settings={currentSettings} onRefresh={fetchAllAdminData} />
              </div>
            )}

            {activeSubTab === "flags" && (
              <FeatureFlagPanel settings={currentSettings} onRefresh={fetchAllAdminData} />
            )}

            {activeSubTab === "broadcasts" && (
              <AnnouncementManager settings={currentSettings} onRefresh={fetchAllAdminData} />
            )}

            {activeSubTab === "settings" && (
              <PlatformSettingsPage settings={currentSettings} onRefresh={fetchAllAdminData} />
            )}

            {activeSubTab === "audit" && (
              <AuditLogViewer logs={auditLogs} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default AdminDashboardPage;
