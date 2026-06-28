import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input, Select } from "../ui/Input";
import { Megaphone, CheckCircle, Save, BellRing } from "lucide-react";
import api from "../../lib/api";
import { useNotifications } from "../../context/NotificationContext";

interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  group: string;
}

interface AnnouncementManagerProps {
  settings: PlatformSetting[];
  onRefresh: () => void;
}

export const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({ settings, onRefresh }) => {
  const { addNotification } = useNotifications();
  const messageSetting = settings.find((s) => s.key === "announcement.message") || { value: "" };
  const enabledSetting = settings.find((s) => s.key === "announcement.enabled") || { value: "true" };

  const [message, setMessage] = useState(messageSetting.value);
  const [enabled, setEnabled] = useState(enabledSetting.value === "true");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMessage(messageSetting.value);
    setEnabled(enabledSetting.value === "true");
  }, [messageSetting.value, enabledSetting.value]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/settings?key=announcement.message&value=${encodeURIComponent(message)}`);
      await api.put(`/admin/settings?key=announcement.enabled&value=${enabled ? "true" : "false"}`);
      addNotification("Broadcast Configured", "Platform wide broadcast parameters deployed.", "success");
      onRefresh();
    } catch (err: any) {
      addNotification("Deployment Failed", err.response?.data?.message || "Verify your connection.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="admin-announcement-manager" className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
          Platform Broadcast Manager
        </h3>
        <p className="text-xs text-zinc-500">
          Configure general announcements displayed in notification banners across the mobile & web viewport frames.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Config Form */}
        <div className="lg:col-span-7">
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60">
            <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-4">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                Broadcast Parameters
              </span>
            </CardHeader>
            <CardBody className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Announcement Alert Message
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Server updates scheduled Sunday at 02:00 UTC."
                  className="w-full text-xs px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">Broadcast Alert Banner</span>
                  <span className="text-[10px] text-zinc-400 leading-normal block max-w-sm">
                    Controls visibility of the alert announcement across the top header of other accounts.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="h-4.5 w-4.5 accent-emerald-500 rounded border-zinc-300 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-900">
                <Button variant="primary" size="sm" icon={Save} onClick={handleSave} disabled={saving}>
                  {saving ? "Deploying announcement..." : "Deploy Announcement"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-900/30 dark:to-zinc-950/20 p-5 space-y-4 h-fit">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Header Alert Visual Mockup
            </span>
            {enabled && message ? (
              <div className="flex items-center gap-3 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 p-4 rounded-xl border border-indigo-500/20 animate-pulse">
                <BellRing className="h-5 w-5 stroke-[2.2] shrink-0" />
                <p className="text-xs font-semibold leading-relaxed">{message}</p>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-zinc-400 font-medium">
                Broadcast disabled. Banners will be hidden from other users.
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
