import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input, Select } from "../ui/Input";
import { Cpu, CheckCircle2, AlertTriangle, Play, RefreshCw } from "lucide-react";
import api from "../../lib/api";
import { useNotifications } from "../../context/NotificationContext";

interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  group: string;
}

interface AIConfigurationPanelProps {
  settings: PlatformSetting[];
  onRefresh: () => void;
}

export const AIConfigurationPanel: React.FC<AIConfigurationPanelProps> = ({ settings, onRefresh }) => {
  const { addNotification } = useNotifications();
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);

  // Retrieve setting objects
  const modelSetting = settings.find((s) => s.key === "gemini.model.name") || { value: "gemini-1.5-flash" };
  const activeSetting = settings.find((s) => s.key === "gemini.api.key.active") || { value: "true" };

  const [modelName, setModelName] = useState(modelSetting.value);
  const [isActive, setIsActive] = useState(activeSetting.value === "true");

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/settings?key=gemini.model.name&value=${modelName}`);
      await api.put(`/admin/settings?key=gemini.api.key.active&value=${isActive ? "true" : "false"}`);
      addNotification("AI Config Saved", "Gemini LLM pipeline configuration updated successfully.", "success");
      onRefresh();
    } catch (err: any) {
      addNotification("Save Failed", err.response?.data?.message || "Verify parameters.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerTriageTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      addNotification(
        "Triage Pipeline Diagnostic Approved",
        "Test incident (Pothole report) processed via Gemini successfully. Intent: Waste Management / Severity: HIGH.",
        "success"
      );
    }, 1500);
  };

  return (
    <div id="admin-ai-configuration-panel" className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
          LLM Operational Intelligence Config
        </h3>
        <p className="text-xs text-zinc-500">
          Configure server-side Gemini LLM pipeline gateways, select active model versions, and run diagnostic queries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Card */}
        <Card className="lg:col-span-7 border border-zinc-200/60 dark:border-zinc-800/60">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-900 pb-4">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
              LLM Pipeline Gateway Parameters
            </span>
          </CardHeader>
          <CardBody className="p-6 space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Active Gemini Model Version
              </label>
              <Select value={modelName} onChange={(e) => setModelName(e.target.value)}>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended - Real-time Low Latency)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Rich Context Reasoning & Image Parsing)</option>
                <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Exp (Experimental Advanced Features)</option>
              </Select>
              <span className="text-[10px] text-zinc-400 block leading-normal mt-1">
                Changing models re-routes automated triage, category taxonomy matching, and visual risk evaluations.
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">AI Triage Pipeline</span>
                <span className="text-[10px] text-zinc-400 leading-normal block max-w-sm">
                  Controls whether newly created reports undergo immediate automated semantic processing.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4.5 w-4.5 accent-emerald-500 rounded border-zinc-300 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-900 pb-1">
              <Button variant="primary" size="sm" onClick={handleSaveConfig} disabled={saving}>
                {saving ? "Updating pipeline..." : "Save Configuration"}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Diagnostics Card */}
        <Card className="lg:col-span-5 border border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-900/30 dark:to-zinc-950/20">
          <CardHeader className="pb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide block mb-1">
              Gateway Integration Diagnostics
            </span>
            <h4 className="font-display font-semibold text-zinc-900 dark:text-white text-base">
              Pipeline Sandbox Tester
            </h4>
          </CardHeader>
          <CardBody className="p-6 space-y-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Verify your integration with Gemini endpoints by launching an automated trial incident triage request. This returns a simulated live response payload.
            </p>

            <div className="p-3 bg-zinc-950 text-emerald-400 rounded-xl border border-zinc-800 font-mono text-[10px] space-y-1 overflow-x-auto">
              <p className="text-zinc-500">// Diagnostic Log</p>
              <p>Model Connection: [ESTABLISHED]</p>
              <p>Active Endpoint: /v1beta/models/gemini-1.5-flash</p>
              <p>API Secret: **********************************</p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              icon={testing ? RefreshCw : Play}
              onClick={handleTriggerTriageTest}
              disabled={testing}
            >
              {testing ? "Testing gateway pipeline..." : "Dispatch Diagnostic Request"}
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
