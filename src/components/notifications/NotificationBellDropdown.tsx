import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import { useShell } from "../../context/ShellContext";
import { Bell, Check, ArrowRight, EyeOff } from "lucide-react";
import { motion } from "motion/react";

interface NotificationBellDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationBellDropdown: React.FC<NotificationBellDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { setActiveTab, setCurrentPath } = useShell();

  if (!isOpen) return null;

  const handleViewAll = () => {
    setActiveTab("notifications");
    setCurrentPath(["App", "CITIZEN Workspace", "Community Dispatch Center"]);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xl z-50 overflow-hidden"
      id="notification-bell-dropdown"
    >
      <div className="p-3.5 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/20">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-50">Live Alerts</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-500 text-white font-black animate-pulse">
              {unreadCount} NEW
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            id="dropdown-mark-all-read"
            onClick={markAllAsRead}
            className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-extrabold flex items-center gap-1"
          >
            <Check className="h-3 w-3" /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[320px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/40">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-400 space-y-2 flex flex-col items-center">
            <EyeOff className="h-6 w-6 text-zinc-300 dark:text-zinc-700" />
            <p className="font-medium">All caught up! No recent alerts.</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notif) => (
            <div
              key={notif.id}
              id={`dropdown-notif-item-${notif.id}`}
              onClick={() => {
                markAsRead(notif.id);
              }}
              className={`p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer text-left space-y-1 relative border-l-3 ${
                !notif.isRead 
                  ? "bg-emerald-500/5 dark:bg-emerald-500/5 border-emerald-500" 
                  : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-50 truncate">
                  {notif.title}
                </span>
                <span className="text-[9px] font-mono text-zinc-400 shrink-0">
                  {notif.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2">
                {notif.message}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/30 flex items-center justify-between">
        <button
          id="btn-dropdown-pref"
          onClick={() => {
            setActiveTab("preferences");
            setCurrentPath(["App", "Settings", "Notification Preferences"]);
            onClose();
          }}
          className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          Preferences
        </button>
        <button
          id="btn-dropdown-view-all"
          onClick={handleViewAll}
          className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline"
        >
          View Dispatch Center <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
};
