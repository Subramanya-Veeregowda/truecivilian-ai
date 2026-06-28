import React from "react";
import { Users2, Award, Zap, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "../ui/Card";

interface VolunteerActivity {
  volunteer: string;
  points: number;
  verifications: number;
}

interface CitizenEngagementChartProps {
  volunteerData: VolunteerActivity[];
  totalCitizens: number;
  totalVolunteers: number;
  loading?: boolean;
}

export const CitizenEngagementChart: React.FC<CitizenEngagementChartProps> = ({
  volunteerData,
  totalCitizens,
  totalVolunteers,
  loading = false
}) => {
  return (
    <Card variant="default" className="h-[400px] flex flex-col" id="card-citizen-engagement">
      <CardHeader className="py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-lg">
            <Users2 className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Citizen Engagement & Leaders</h3>
            <p className="text-xs text-zinc-400">Civilian database activity and top field volunteers</p>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex-1 min-h-0 p-5 flex flex-col md:flex-row gap-5 relative overflow-y-auto">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zinc-950/50">
            <div className="animate-spin h-5 w-5 border-2 border-teal-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Core Metrics Column */}
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-800/20 p-4.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 space-y-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Registered Citizens</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-800 dark:text-zinc-100">{totalCitizens.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+12% MoM</span>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/20 p-4.5 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 space-y-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Active Field Volunteers</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-800 dark:text-zinc-100">{totalVolunteers.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+8.5% MoM</span>
                </div>
              </div>
            </div>

            {/* Volunteer Leaderboard Column */}
            <div className="flex-[1.2] flex flex-col min-h-0 border-t md:border-t-0 md:border-l border-zinc-100 dark:border-zinc-800/80 pt-4 md:pt-0 md:pl-5">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-3.5 flex items-center gap-1.5 uppercase tracking-wider">
                <Award className="h-4 w-4 text-amber-500" />
                Volunteer Honour Roll
              </span>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {volunteerData.slice(0, 4).map((vol, idx) => (
                  <div 
                    key={idx} 
                    id={`leaderboard-item-${idx}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/60 shadow-sm hover:border-teal-500/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-bold text-xs ${
                        idx === 0 
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                          : idx === 1
                          ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                          : "bg-zinc-50 text-zinc-500 dark:bg-zinc-800/40 dark:text-zinc-400"
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{vol.volunteer}</p>
                        <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                          <CheckCircle2 className="h-3 w-3 text-teal-500" />
                          {vol.verifications} verifications
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold text-xs">
                      <Zap className="h-3.5 w-3.5 fill-teal-500/10" />
                      {vol.points} XP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};
