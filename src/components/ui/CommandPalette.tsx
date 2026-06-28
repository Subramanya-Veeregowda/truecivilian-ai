import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Layout, ShieldAlert, AlertTriangle, RefreshCw, X, HelpCircle, Monitor, Compass, UserCheck } from "lucide-react";
import { useShell, LayoutType, UserRole } from "../../context/ShellContext";
import { useTheme } from "../../context/ThemeContext";
import { useNotifications } from "../../context/NotificationContext";

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setLayout,
    setRole,
    role,
    layout,
  } = useShell();

  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotifications();

  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearch("");
    }
  }, [isCommandPaletteOpen]);

  const items = [
    {
      category: "Navigation & Layouts",
      actions: [
        { name: "Switch to Landing View", desc: "Show product marketing details", icon: Compass, action: () => setLayout("landing") },
        { name: "Switch to Authenticated Shell", desc: "Enter active client dashboard", icon: Layout, action: () => setLayout("authenticated") },
        { name: "Simulate Loading state", desc: "Display skeletal loading screen", icon: RefreshCw, action: () => setLayout("loading") },
        { name: "Simulate System Error layout", desc: "Display critical traceback failure", icon: ShieldAlert, action: () => setLayout("error") },
        { name: "Simulate 404 Missing page", desc: "Show 404 Route placeholder", icon: HelpCircle, action: () => setLayout("404") },
        { name: "Simulate Maintenance page", desc: "Show maintenance mode page", icon: AlertTriangle, action: () => setLayout("maintenance") },
      ],
    },
    {
      category: "Security Roles (Dev Mode)",
      actions: [
        { name: "Act as Citizen", desc: "Triage public reports, submit listings", icon: UserCheck, action: () => setRole("citizen") },
        { name: "Act as Volunteer", desc: "Validate nearby issues, complete tasks", icon: UserCheck, action: () => setRole("volunteer") },
        { name: "Act as Authority Officer", desc: "Review dispatch logs, triage issues", icon: UserCheck, action: () => setRole("authority") },
        { name: "Act as Super Administrator", desc: "Full controls over system state", icon: UserCheck, action: () => setRole("admin") },
      ],
    },
    {
      category: "Quick Utilities",
      actions: [
        { name: "Toggle Theme Preference", desc: `Active style: ${theme.toUpperCase()}`, icon: Monitor, action: () => toggleTheme() },
        { name: "Simulate Incoming Report", desc: "Create a live mock notification card", icon: Sparkles, action: () => {
          addNotification("Urgent Pothole Flagged", "A new high-priority pothole has been detected near Main St.", "alert");
        }},
      ],
    },
  ];

  const filteredItems = items
    .map((cat) => ({
      ...cat,
      actions: cat.actions.filter(
        (act) =>
          act.name.toLowerCase().includes(search.toLowerCase()) ||
          act.desc.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.actions.length > 0);

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCommandPaletteOpen(false)}
          className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm"
        />

        {/* Palette Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
        >
          {/* Header Search Field */}
          <div className="flex items-center border-b border-zinc-100 dark:border-zinc-800 px-4 py-3.5 gap-3">
            <Search className="h-5 w-5 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search shortcuts and layouts... (or ESC to cancel)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm bg-transparent border-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            />
            <button
              onClick={() => setIsCommandPaletteOpen(false)}
              className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-400 hover:text-zinc-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
            {filteredItems.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">
                No matching command patterns detected.
              </div>
            ) : (
              filteredItems.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <span className="px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    {cat.category}
                  </span>
                  <div className="space-y-0.5">
                    {cat.actions.map((act) => {
                      const Icon = act.icon;
                      return (
                        <button
                          key={act.name}
                          onClick={() => {
                            act.action();
                            setIsCommandPaletteOpen(false);
                          }}
                          className="w-full flex items-center justify-between text-left p-3.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40 text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {act.name}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {act.desc}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 uppercase">
                            Enter
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Help Footer */}
          <div className="border-t border-zinc-100 dark:border-zinc-850 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/40 text-[10px] sm:text-xs text-zinc-400 flex justify-between select-none font-mono">
            <span>↑↓ to navigate</span>
            <span>Ctrl + K to toggle anytime</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
