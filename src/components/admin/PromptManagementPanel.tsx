import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { TextArea } from "../ui/Input";
import { Sparkles, Save, RotateCcw, AlertCircle } from "lucide-react";
import api from "../../lib/api";
import { useNotifications } from "../../context/NotificationContext";

interface PlatformSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  group: string;
}

interface PromptManagementPanelProps {
  settings: PlatformSetting[];
  onRefresh: () => void;
}

export const PromptManagementPanel: React.FC<PromptManagementPanelProps> = ({ settings, onRefresh }) => {
  const { addNotification } = useNotifications();
  const promptSetting = settings.find((s) => s.key === "ai.prompt.triage") || {
    value: "Identify category, prioritize severity (LOW, MEDIUM, HIGH, CRITICAL) and evaluate hazardous risk of municipal incidents.",
  };

  const [promptValue, setPromptValue] = useState(promptSetting.value);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPromptValue(promptSetting.value);
  }, [promptSetting.value]);

  const handleSavePrompt = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/settings?key=ai.prompt.triage&value=${encodeURIComponent(promptValue)}`);
      addNotification("Prompt Template Updated", "New triage system instructions deployed successfully.", "success");
      onRefresh();
    } catch (err: any) {
      addNotification("Save Failed", err.response?.data?.message || "An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefaults = () => {
    const defaultPrompt =
      "Identify category, prioritize severity (LOW, MEDIUM, HIGH, CRITICAL) and evaluate hazardous risk of municipal incidents.";
    setPromptValue(defaultPrompt);
    addNotification("Template Restored", "Default prompt template mapped to editor state. Submit to deploy.", "success");
  };

  return (
    <div id="admin-prompt-management-panel" className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
          LLM Prompt Engineering Console
        </h3>
        <p className="text-xs text-zinc-500">
          Govern instructions, role constraints, and output structures injected into the Gemini API requests during auto-triage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500 stroke-[2.2]" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Active Instruction Template Editor
                </span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded font-bold font-mono">
                SYSTEM INSTRUCTIONS
              </span>
            </CardHeader>
            <CardBody className="p-0">
              <textarea
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                className="w-full p-6 text-xs font-mono bg-white dark:bg-zinc-950 text-zinc-900 dark:text-emerald-400 focus:outline-none min-h-[320px] leading-relaxed resize-y border-0"
                placeholder="Enter system prompt for Gemini..."
              />
              <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-100 dark:border-zinc-900/60">
                <Button variant="secondary" size="xs" icon={RotateCcw} onClick={handleRestoreDefaults}>
                  Restore Defaults
                </Button>
                <Button variant="primary" size="xs" icon={Save} onClick={handleSavePrompt} disabled={saving}>
                  {saving ? "Deploying instructions..." : "Save & Deploy Prompt"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Informational Guidance panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60 p-5 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-4 h-fit">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
                  Formatting Directives
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
                  Your prompt rules tell Gemini how to structure classification responses. If rules are missing, automatic dispatch may fallback or fail.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-[10px] border-t border-zinc-200/50 dark:border-zinc-800/50">
              <div className="space-y-1">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Expected Keys:</span>
                <p className="text-zinc-400 leading-relaxed">
                  The model extracts a JSON response mapping containing fields such as: <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-red-400">category</code>, <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-red-400">priority</code>, <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-red-400">hazardRating</code>, and <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-red-400">reasoning</code>.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">Valid Priority Enums:</span>
                <p className="text-zinc-400 leading-relaxed font-mono">
                  LOW, MEDIUM, HIGH, CRITICAL
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
