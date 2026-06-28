import React, { useState } from "react";
import { Bell, Mail, MessageSquare, Smartphone, Save, Check } from "lucide-react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";

export const NotificationPreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    issueAssigned: { email: true, push: true, sms: false },
    issueVerified: { email: false, push: true, sms: false },
    issueResolved: { email: true, push: true, sms: true },
    newComment: { email: true, push: true, sms: false },
    authorityUpdate: { email: true, push: true, sms: true },
    badgeEarned: { email: true, push: true, sms: false },
    challengeCompleted: { email: false, push: true, sms: true },
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const togglePref = (key: keyof typeof preferences, channel: "email" | "push" | "sms") => {
    setPreferences((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [channel]: !prev[key][channel],
      },
    }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  const prefRows = [
    { key: "issueAssigned", label: "Issue Assigned", desc: "When a report you watch or filed is routed to a municipal team" },
    { key: "issueVerified", label: "Issue Verified", desc: "When community audits confirm your report's validity" },
    { key: "issueResolved", label: "Issue Resolved", desc: "When the authority resolves and closes your issue" },
    { key: "newComment", label: "New Comments & Replies", desc: "When citizens comment on your reports" },
    { key: "authorityUpdate", label: "Authority Updates", desc: "Official comments, statements, or status adjustments" },
    { key: "badgeEarned", label: "Badge Earned", desc: "When you cross XP benchmarks and unlock community badges" },
    { key: "challengeCompleted", label: "Challenge Completed", desc: "Daily or weekly challenge completions and milestone alerts" },
  ] as const;

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6" id="notif-pref-page">
      <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            Notification Settings
          </h1>
          <p className="text-xs text-zinc-400">Control how and when you receive updates from TrueCivilian</p>
        </div>
      </div>

      <Card variant="default">
        <CardHeader className="py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-500" />
            <div>
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Delivery Channels</h3>
              <p className="text-[10px] text-zinc-400">Configure notification paths for community updates</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-4 sm:p-6 divide-y divide-zinc-100 dark:divide-zinc-800/60">
          <div className="grid grid-cols-12 pb-4 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <div className="col-span-6 sm:col-span-7">Notification Event</div>
            <div className="col-span-2 text-center">In-App</div>
            <div className="col-span-2 text-center">Email</div>
            <div className="col-span-2 text-center">SMS</div>
          </div>

          {prefRows.map((row) => (
            <div key={row.key} className="grid grid-cols-12 py-4 items-center gap-2">
              <div className="col-span-6 sm:col-span-7 pr-4">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{row.label}</h4>
                <p className="text-[10px] text-zinc-450 dark:text-zinc-400 mt-0.5 leading-normal">{row.desc}</p>
              </div>
              
              {/* In-App / Push */}
              <div className="col-span-2 flex justify-center">
                <button
                  id={`pref-${row.key}-push`}
                  onClick={() => togglePref(row.key, "push")}
                  className={`p-1.5 rounded-lg border transition-all ${
                    preferences[row.key].push
                      ? "bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400"
                      : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-400"
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>

              {/* Email */}
              <div className="col-span-2 flex justify-center">
                <button
                  id={`pref-${row.key}-email`}
                  onClick={() => togglePref(row.key, "email")}
                  className={`p-1.5 rounded-lg border transition-all ${
                    preferences[row.key].email
                      ? "bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400"
                      : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-400"
                  }`}
                >
                  <Mail className="h-4 w-4" />
                </button>
              </div>

              {/* SMS */}
              <div className="col-span-2 flex justify-center">
                <button
                  id={`pref-${row.key}-sms`}
                  onClick={() => togglePref(row.key, "sms")}
                  className={`p-1.5 rounded-lg border transition-all ${
                    preferences[row.key].sms
                      ? "bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400"
                      : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-400"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-6 flex justify-end">
            <Button
              id="btn-save-notification-preferences"
              variant={saved ? "success" : "primary"}
              onClick={handleSave}
              isLoading={saving}
              icon={saved ? Check : Save}
            >
              {saved ? "Preferences Saved" : "Save Changes"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
