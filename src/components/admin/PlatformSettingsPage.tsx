import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Save, AlertCircle, Cpu, Settings } from "lucide-react";
import api from "../../lib/api";
import { useNotifications } from "../../context/NotificationContext";

interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  group: string;
}

interface PlatformSettingsPageProps {
  settings: PlatformSetting[];
  onRefresh: () => void;
}

export const PlatformSettingsPage: React.FC<PlatformSettingsPageProps> = ({ settings, onRefresh }) => {
  const { addNotification } = useNotifications();
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Group settings that aren't flags, prompts or announcements
  const systemSettings = settings.filter(
    (s) => s.group === "SYSTEM" || (!s.key.startsWith("feature.") && !s.key.startsWith("announcement.") && s.key !== "ai.prompt.triage")
  );

  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const vals: Record<string, string> = {};
    systemSettings.forEach((s) => {
      vals[s.key] = s.value;
    });
    setFormValues(vals);
  }, [settings]);

  const handleInputChange = (key: string, val: string) => {
    setFormValues({ ...formValues, [key]: val });
  };

  const handleSaveSetting = async (key: string) => {
    setSavingKey(key);
    const val = formValues[key];
    try {
      await api.put(`/admin/settings?key=${key}&value=${encodeURIComponent(val)}`);
      addNotification("Platform Setting Saved", `System value for ${key} modified successfully.`, "success");
      onRefresh();
    } catch (err: any) {
      addNotification("Save Failed", err.response?.data?.message || "An error occurred", "error");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div id="admin-platform-settings-page" className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
          Platform System Variables
        </h3>
        <p className="text-xs text-zinc-500">
          Re-align overall system rate limits, toggle maintenance mode, and adjust global SLA variables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings grid list */}
        <div className="lg:col-span-8 space-y-6">
          {systemSettings.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400">No general settings records found.</div>
          ) : (
            systemSettings.map((setting) => (
              <Card key={setting.key} className="border border-zinc-200/60 dark:border-zinc-800/60">
                <CardBody className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-zinc-900 dark:text-white font-mono">
                        <Settings className="h-4 w-4 text-zinc-400" />
                        <span>{setting.key}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        {setting.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="text"
                      value={formValues[setting.key] || ""}
                      onChange={(e) => handleInputChange(setting.key, e.target.value)}
                      className="flex-1 text-xs px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Save}
                      disabled={savingKey === setting.key}
                      onClick={() => handleSaveSetting(setting.key)}
                    >
                      {savingKey === setting.key ? "Deploying..." : "Update"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>

        {/* Info panel */}
        <div className="lg:col-span-4">
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60 p-5 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-4 h-fit">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
                  Operational Safety
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                  Values defined here control foundational API constraints. Incorrect rate limit numbers or syntax errors can cause cascading gateway issues.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
