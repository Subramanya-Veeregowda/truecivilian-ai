import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { ToggleLeft, ToggleRight, Sparkles, UserCheck, ShieldAlert } from "lucide-react";
import api from "../../lib/api";
import { useNotifications } from "../../context/NotificationContext";

interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  group: string;
}

interface FeatureFlagPanelProps {
  settings: PlatformSetting[];
  onRefresh: () => void;
}

export const FeatureFlagPanel: React.FC<FeatureFlagPanelProps> = ({ settings, onRefresh }) => {
  const { addNotification } = useNotifications();
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  // Filter feature flag settings
  const flags = settings.filter((s) => s.group === "FEATURE_FLAG" || s.key.startsWith("feature."));

  const handleToggle = async (key: string, currentVal: string) => {
    setUpdatingKey(key);
    const nextVal = currentVal === "true" ? "false" : "true";
    try {
      await api.put(`/admin/settings?key=${key}&value=${nextVal}`);
      addNotification("Feature State Saved", `Flag ${key} updated successfully.`, "success");
      onRefresh();
    } catch (err: any) {
      addNotification("Toggle Failed", err.response?.data?.message || "An error occurred", "error");
    } finally {
      setUpdatingKey(null);
    }
  };

  return (
    <div id="admin-feature-flag-panel" className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
          System Feature Toggles
        </h3>
        <p className="text-xs text-zinc-500">
          Activate or decommission optional system features, adjust routing algorithms, and manage citizen privileges dynamically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flags.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-zinc-400">
            No active feature toggles detected.
          </div>
        ) : (
          flags.map((flag) => {
            const isActive = flag.value === "true";
            return (
              <Card
                key={flag.key}
                className="hover:shadow-md transition-all border border-zinc-200/50 dark:border-zinc-800/50 relative overflow-hidden"
              >
                <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
                        {flag.key}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.2 rounded border ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-800"
                        }`}
                      >
                        {isActive ? "LIVE" : "DARK_LAUNCH"}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{flag.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-900/60">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">
                      Toggle Feature State
                    </span>
                    <button
                      disabled={updatingKey === flag.key}
                      onClick={() => handleToggle(flag.key, flag.value)}
                      className={`transition-colors p-1 rounded-lg ${
                        isActive ? "text-emerald-500 hover:text-emerald-600" : "text-zinc-400 hover:text-zinc-600"
                      }`}
                    >
                      {isActive ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                    </button>
                  </div>
                </CardBody>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
