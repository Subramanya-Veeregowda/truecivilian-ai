import React, { useState } from "react";
import { useShell, UserRole, LayoutType } from "../../context/ShellContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { Card, CardBody } from "../ui/Card";
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Compass, 
  Map, 
  PlusCircle, 
  Trophy, 
  Shield, 
  LayoutDashboard, 
  CheckCircle, 
  Award, 
  Layers, 
  GitPullRequest,
  Check, 
  User, 
  LogOut, 
  Settings, 
  Terminal, 
  Moon, 
  Sun,
  MapPin,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Info,
  BarChart2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NotificationBellDropdown } from "../notifications/NotificationBellDropdown";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const { 
    role, 
    setRole, 
    layout, 
    setLayout, 
    currentPath, 
    setCurrentPath, 
    setIsCommandPaletteOpen,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab
  } = useShell();

  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const { user, logout } = useAuth();

  // Navigation Popover states
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDevPanelOpen, setIsDevPanelOpen] = useState(true);

  // Dynamic Navigation definitions based on current selected role
  const getRoleNavItems = () => {
    switch (role) {
      case "citizen":
        return [
          { id: "feed", name: "Citizen Feed", icon: Compass },
          { id: "map", name: "Interactive Map", icon: Map },
          { id: "report", name: "Report New Issue", icon: PlusCircle },
          { id: "leaderboard", name: "Trophy Leaderboard", icon: Trophy },
        ];
      case "volunteer":
        return [
          { id: "verify", name: "Verification Queue", icon: CheckCircle },
          { id: "map", name: "Interactive Map", icon: Map },
          { id: "achievements", name: "Achievements & Badges", icon: Award },
        ];
      case "authority":
        return [
          { id: "dashboard", name: "Dispatch Dashboard", icon: LayoutDashboard },
          { id: "map", name: "Interactive Map", icon: Map },
          { id: "triage", name: "Department Queue", icon: Layers },
          { id: "analytics", name: "Business Intelligence", icon: BarChart2 },
        ];
      case "admin":
        return [
          { id: "system", name: "System Control", icon: Shield },
          { id: "map", name: "Interactive Map", icon: Map },
          { id: "logs", name: "Diagnostics Matrix", icon: GitPullRequest },
          { id: "analytics", name: "Business Intelligence", icon: BarChart2 },
        ];
      default:
        return [];
    }
  };

  const navItems = getRoleNavItems();

  const handleTabClick = (tabId: string, tabName: string) => {
    setActiveTab(tabId);
    setCurrentPath(["App", `${role.toUpperCase()} Workspace`, tabName]);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col md:flex-row transition-colors duration-300">
      
      {/* 1. DESKTOP SIDEBAR (Visible md+) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200/60 dark:border-zinc-800/60 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-100 dark:border-zinc-850 gap-3 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-base shadow-md">
            TC
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white leading-none">
              TrueCivilian
            </h1>
            <span className="text-[10px] text-zinc-400 font-medium">Enterprise Shell</span>
          </div>
        </div>

        {/* Current Active Workspace Role Banner */}
        <div className="px-4 py-3 shrink-0">
          <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-xl p-3 border border-zinc-100 dark:border-zinc-850 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Active Role</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                {role}
              </span>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Dynamic Sidebar Nav Links */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          <span className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            Navigation Menu
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id, item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isTabActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-850/50"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isTabActive ? "text-emerald-500" : "text-zinc-400"}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Help Footer */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-850 space-y-2 text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-mono text-[10px]">Ctrl + K Palette Active</span>
          </div>
        </div>
      </aside>

      {/* 2. DYNAMIC WORKSPACE BODY CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* RESPONSIVE TOP NAV (Visible all breakpoints) */}
        <header className="h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6">
          
          {/* Mobile Hamburg Trigger & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Navigation Trail */}
            <nav className="hidden sm:flex items-center space-x-1.5 text-xs text-zinc-400">
              <span className="font-medium hover:text-zinc-600 transition-colors">TrueCivilian</span>
              {currentPath.map((item, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="h-3 w-3 text-zinc-300" />
                  <span className={idx === currentPath.length - 1 ? "font-bold text-zinc-800 dark:text-white" : "font-medium"}>
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Interactive Search Bar / Command Palette Trigger */}
          <div className="flex-1 max-w-md mx-6 hidden md:block">
            <div 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/30 text-xs text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-zinc-400" />
                <span>Search features, shortcuts...</span>
              </div>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 font-mono text-[9px] font-bold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-sm text-zinc-400">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Top Nav Right Action Utilities */}
          <div className="flex items-center gap-2.5">
            
            {/* Search Trigger for Mobile */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="md:hidden p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Notification Bell Dropdown Panel */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsProfileOpen(false);
                }}
                className="p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors relative"
              >
                <Bell className="h-4.5 w-4.5 text-zinc-500 dark:text-zinc-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationOpen && (
                  <NotificationBellDropdown
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors text-zinc-500"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User Profile Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationOpen(false);
                }}
                className="h-9.5 w-9.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 transition-colors"
              >
                <User className="h-4.5 w-4.5" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-1.5"
                  >
                    <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-850 text-left">
                      <p className="font-bold text-xs text-zinc-900 dark:text-white">
                        {user ? `${user.firstName} ${user.lastName}` : "Active User"}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate">
                        {user ? user.email : "user@example.com"}
                      </p>
                    </div>
                    <div className="p-1 space-y-0.5">
                      <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-left transition-colors">
                        <Settings className="h-4 w-4 text-zinc-400" />
                        <span>Account Setup</span>
                      </button>
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-rose-500" />
                        <span>Sign Out Portal</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* 3. CORE AUTHENTICATED CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Active Workspace Header summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                TrueCivilian Workspace
              </span>
              <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                {role.toUpperCase()} Administration Console
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                You are operating under active deployment variables in {role} mode. All database logs are synchronized.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsDevPanelOpen(!isDevPanelOpen)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/20"
              >
                {isDevPanelOpen ? "Hide Dev Switchers" : "Show Dev Switchers"}
              </button>
            </div>
          </div>

          {/* Development Mode Switcher Panel (Visible when opened) */}
          {isDevPanelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-zinc-100 dark:bg-zinc-950/60 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Development Environment Toggles</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["citizen", "volunteer", "authority", "admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setActiveTab(r === "citizen" ? "feed" : r === "volunteer" ? "verify" : r === "authority" ? "dashboard" : "system");
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      role === r
                        ? "bg-emerald-600 text-white shadow"
                        : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50"
                    }`}
                  >
                    Act as {r.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/40">
                <span className="text-[10px] font-bold text-zinc-400 mr-2 flex items-center">Simulate Layout Page:</span>
                {(["landing", "loading", "error", "404", "maintenance"] as LayoutType[]).map((lay) => (
                  <button
                    key={lay}
                    onClick={() => setLayout(lay)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
                  >
                    {lay.toUpperCase()}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Render the core children panel inside our Shell */}
          <div className="space-y-8 animate-fade-in">
            {children}
          </div>

        </main>

        {/* MOBILE BOTTOM NAVIGATION (Visible only on sm- screens) */}
        <nav className="md:hidden sticky bottom-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 h-16 flex items-center justify-around px-2 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id, item.name)}
                className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-bold transition-all ${
                  isTabActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Icon className="h-5 w-5 mb-0.5" />
                <span className="truncate max-w-[64px]">{item.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </nav>

      </div>

      {/* 4. DRAWER MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop slide-in */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm"
            />
            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-64 max-w-[80vw] bg-white dark:bg-zinc-900 h-full flex flex-col p-4 border-r border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">TC</div>
                  <span className="font-bold text-sm">TrueCivilian</span>
                </div>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-850">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide block">Role Active</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{role.toUpperCase()}</span>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isTabActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id, item.name)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isTabActive
                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5 text-zinc-400" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
