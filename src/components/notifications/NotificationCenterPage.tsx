import React, { useState } from "react";
import { useNotifications, NotificationItem } from "../../context/NotificationContext";
import { 
  Bell, 
  Trash2, 
  Check, 
  Award, 
  Trophy, 
  Wrench, 
  FileText, 
  MessageCircle, 
  UserPlus, 
  ShieldAlert, 
  Sparkles, 
  Eye, 
  Mail, 
  SlidersHorizontal 
} from "lucide-react";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Button } from "../ui/Button";

export const NotificationCenterPage: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotification, 
    clearAll 
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<"ALL" | "UNREAD" | "BADGES" | "CHALLENGES" | "ISSUES">("ALL");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BADGE_AWARDED":
      case "BADGE_EARNED":
        return <Award className="h-5 w-5 text-amber-500 animate-[bounce_1s_ease-in-out_infinite]" />;
      case "CHALLENGE_COMPLETED":
      case "CHALLENGE_UPDATE":
        return <Trophy className="h-5 w-5 text-emerald-500" />;
      case "ISSUE_ASSIGNED":
        return <Wrench className="h-5 w-5 text-blue-500" />;
      case "ISSUE_RESOLVED":
        return <Check className="h-5 w-5 text-emerald-500" />;
      case "NEW_COMMENT":
      case "NEW_REPLY":
        return <MessageCircle className="h-5 w-5 text-indigo-500" />;
      case "NEW_FOLLOWER":
        return <UserPlus className="h-5 w-5 text-teal-500" />;
      case "AUTHORITY_UPDATE":
        return <ShieldAlert className="h-5 w-5 text-orange-500" />;
      case "AI_ANALYSIS_COMPLETE":
        return <Sparkles className="h-5 w-5 text-fuchsia-500" />;
      default:
        return <FileText className="h-5 w-5 text-zinc-400" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case "BADGE_AWARDED":
      case "BADGE_EARNED":
        return "bg-amber-500/10 dark:bg-amber-500/20";
      case "CHALLENGE_COMPLETED":
        return "bg-emerald-500/10 dark:bg-emerald-500/20";
      case "ISSUE_ASSIGNED":
        return "bg-blue-500/10 dark:bg-blue-500/20";
      case "AI_ANALYSIS_COMPLETE":
        return "bg-fuchsia-500/10 dark:bg-fuchsia-500/20";
      default:
        return "bg-zinc-100 dark:bg-zinc-800";
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === "UNREAD") return !notif.isRead;
    if (activeFilter === "BADGES") return notif.type.includes("BADGE");
    if (activeFilter === "CHALLENGES") return notif.type.includes("CHALLENGE");
    if (activeFilter === "ISSUES") return notif.type.includes("ISSUE");
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6" id="notification-center-root">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-150 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl shrink-0">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              Community Dispatch Center
            </h1>
            <p className="text-xs text-zinc-400">Manage, read, and audit real-time alerts, system logs, and volunteer updates.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              id="btn-notif-mark-all-read"
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              icon={Check}
            >
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              id="btn-notif-clear-all"
              variant="outline"
              size="sm"
              onClick={clearAll}
              icon={Trash2}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40">
          {(["ALL", "UNREAD", "BADGES", "CHALLENGES", "ISSUES"] as const).map((filter) => (
            <button
              key={filter}
              id={`tab-filter-${filter.toLowerCase()}`}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === filter
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-450 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {filter}
              {filter === "UNREAD" && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] bg-rose-500 text-white font-extrabold">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications list */}
      <Card variant="default">
        <CardBody className="p-0 divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center">
                <Bell className="h-5 w-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No Notifications Found</p>
                <p className="text-xs text-zinc-400 mt-1">There are no matching items under the "{activeFilter.toLowerCase()}" filter.</p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                id={`notif-item-${notif.id}`}
                className={`p-4 sm:p-5 flex items-start gap-4 transition-all ${
                  !notif.isRead
                    ? "bg-emerald-500/5 dark:bg-emerald-500/5 border-l-3 border-emerald-500"
                    : "bg-white dark:bg-zinc-900 border-l-3 border-transparent"
                }`}
              >
                {/* Type Icon wrapper */}
                <div className={`p-2.5 rounded-xl ${getNotificationBg(notif.type)} shrink-0`}>
                  {getNotificationIcon(notif.type)}
                </div>

                {/* Body details */}
                <div className="flex-grow space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {notif.title}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    {notif.message}
                  </p>
                  
                  {/* Footer actions */}
                  <div className="flex items-center gap-4 pt-2">
                    {!notif.isRead ? (
                      <button
                        id={`btn-mark-read-${notif.id}`}
                        onClick={() => markAsRead(notif.id)}
                        className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" /> Mark as Read
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-400 flex items-center gap-1">
                        <Check className="h-3 w-3 text-zinc-400" /> Read
                      </span>
                    )}

                    <button
                      id={`btn-delete-${notif.id}`}
                      onClick={() => clearNotification(notif.id)}
                      className="text-[10px] font-extrabold text-zinc-400 hover:text-rose-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>
    </div>
  );
};
