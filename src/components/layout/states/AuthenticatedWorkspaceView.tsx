import React, { useState } from "react";
import { useShell } from "../../../context/ShellContext";
import { Card, CardHeader, CardBody, CardFooter } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Input, TextArea, Select } from "../../ui/Input";
import { Table, CustomMiniChart } from "../../ui/Feedback";
import { useNotifications } from "../../../context/NotificationContext";
import { IssueReportingWizard } from "../../issues/IssueReportingWizard";
import { CitizenMapPage } from "../../maps/CitizenMapPage";
import { CommunityFeedPage } from "../../community/CommunityFeedPage";
import { AuthorityDashboardPage } from "../../authority/AuthorityDashboardPage";
import { AdminDashboardPage } from "../../admin/AdminDashboardPage";
import { AnalyticsDashboardPage } from "../../analytics/AnalyticsDashboardPage";
import { NotificationCenterPage } from "../../notifications/NotificationCenterPage";
import { NotificationPreferencesPage } from "../../notifications/NotificationPreferencesPage";
import { GamificationHub } from "../../gamification/GamificationHub";
import { 
  Plus, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  ShieldCheck, 
  Send, 
  Settings, 
  Compass, 
  HelpCircle,
  Trophy,
  Award,
  Layers,
  GitPullRequest,
  ChevronLeft
} from "lucide-react";

export const AuthenticatedWorkspaceView: React.FC = () => {
  const { role, activeTab } = useShell();
  const { addNotification } = useNotifications();

  if (activeTab === "map") {
    return <CitizenMapPage />;
  }

  if (activeTab === "feed") {
    return <CommunityFeedPage />;
  }

  if (activeTab === "analytics") {
    return <AnalyticsDashboardPage />;
  }

  if (activeTab === "notifications") {
    return <NotificationCenterPage />;
  }

  if (activeTab === "preferences") {
    return <NotificationPreferencesPage />;
  }

  if (activeTab === "gamification" || activeTab === "leaderboard" || activeTab === "achievements") {
    return <GamificationHub />;
  }

  // Citizen States
  const [citizenReport, setCitizenReport] = useState({ category: "road", desc: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenReport.desc) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addNotification(
        "Report Created Successfully", 
        `Your submission regarding ${citizenReport.category.toUpperCase()} has been generated and dispatched.`,
        "success"
      );
      setCitizenReport({ category: "road", desc: "" });
    }, 1200);
  };

  // Volunteer States
  const [completedTask, setCompletedTask] = useState<string[]>([]);
  const toggleCompleteTask = (id: string, name: string) => {
    if (completedTask.includes(id)) return;
    setCompletedTask([...completedTask, id]);
    addNotification(
      "Task Verification Approved",
      `Thank you for confirming the status of: ${name}. Points awarded.`,
      "success"
    );
  };

  return (
    <div className="space-y-8">
      
      {/* 1. CITIZEN VIEW PANEL */}
      {role === "citizen" && (
        <div className="space-y-6">
          {isReporting ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setIsReporting(false)}
                  icon={ChevronLeft}
                >
                  Back to Dashboard
                </Button>
              </div>
              <IssueReportingWizard onComplete={() => setIsReporting(false)} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Call to action card */}
              <Card className="lg:col-span-5 h-fit">
                <CardHeader>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider font-mono">TrueCivilian AI Portal</span>
                    <h3 className="font-display font-semibold text-zinc-900 dark:text-white text-base">
                      File a New Civic Report
                    </h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Submit potholes, sewage leakage, power damage, or waste concerns directly to local authorities using our guided multi-step form wizard.
                  </p>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      <Plus className="h-4 w-4 text-emerald-500" />
                      <span>Wizard Quick-Steps</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">1. Upload media files, images, voice dictations.</p>
                    <p className="text-[10px] text-zinc-400">2. Lock coordinates using device-aware GPS.</p>
                    <p className="text-[10px] text-zinc-400">3. Classify details, severity, priority levels.</p>
                  </div>
                  <Button
                    onClick={() => setIsReporting(true)}
                    variant="primary"
                    className="w-full py-3"
                    icon={Plus}
                  >
                    Start Guided Wizard
                  </Button>
                </CardBody>
              </Card>

              {/* Active Incident List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Municipal Tracking Table</h4>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold font-mono">GPS RADIUS SEARCH</span>
                </div>
                <Table headers={["Incident", "Coordinates", "Triage Queue", "Status"]}>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Pothole Blockage</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-400">12.971° N, 77.594° E</td>
                    <td className="px-6 py-4 text-xs">Road Board</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                        REPAIRED
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white">Water Main Burst</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-400">12.927° N, 77.627° E</td>
                    <td className="px-6 py-4 text-xs">Sewerage Desk</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold animate-pulse">
                        DISPATCHED
                      </span>
                    </td>
                  </tr>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. VOLUNTEER VIEW PANEL */}
      {role === "volunteer" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader><span className="text-sm font-semibold">Triage Score</span></CardHeader>
              <CardBody className="text-center py-6">
                <span className="text-3xl font-black text-emerald-500">1,240 pts</span>
                <p className="text-xs text-zinc-400 mt-2">Level 4: Master Verifier Badge</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader><span className="text-sm font-semibold">Monthly Tasks Completed</span></CardHeader>
              <CardBody className="text-center py-6">
                <span className="text-3xl font-black text-indigo-500">28 approved</span>
                <p className="text-xs text-zinc-400 mt-2">Top 5% across Ward 102</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader><span className="text-sm font-semibold">Nearby Incidents to Verify</span></CardHeader>
              <CardBody className="text-center py-6">
                <span className="text-3xl font-black text-amber-500">3 pending</span>
                <p className="text-xs text-zinc-400 mt-2">Requires site check</p>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Site Verification Challenges</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: "v1", name: "Water leakage at Sector 3 circle", desc: "Reported: 3 hours ago. Check if water main burst remains active or has stopped draining." },
                { id: "v2", name: "Dumping site near Ward 4 school", desc: "Reported: 6 hours ago. Verify if the garbage collection team successfully cleared the block." },
              ].map((task) => (
                <Card key={task.id} variant="flat" className="relative overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors">
                  <CardBody className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      <h3 className="font-bold text-sm text-zinc-900 dark:text-white">{task.name}</h3>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{task.desc}</p>
                    <Button
                      variant={completedTask.includes(task.id) ? "success" : "primary"}
                      size="sm"
                      onClick={() => toggleCompleteTask(task.id, task.name)}
                      icon={CheckCircle}
                    >
                      {completedTask.includes(task.id) ? "Task Confirmed" : "Confirm On-Site State"}
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. AUTHORITY VIEW PANEL */}
      {role === "authority" && (
        <AuthorityDashboardPage />
      )}

      {/* 4. ADMIN VIEW PANEL */}
      {role === "admin" && (
        <AdminDashboardPage />
      )}

    </div>
  );
};
