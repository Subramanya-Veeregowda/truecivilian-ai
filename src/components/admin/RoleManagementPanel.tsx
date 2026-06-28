import React from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Shield, Users, Landmark, Heart } from "lucide-react";

interface User {
  roles: Array<{ name: string }>;
}

interface RoleManagementPanelProps {
  users: User[];
}

export const RoleManagementPanel: React.FC<RoleManagementPanelProps> = ({ users }) => {
  // Count users per role
  const roleCounts = users.reduce(
    (acc, user) => {
      if (user.roles && user.roles.length > 0) {
        const role = user.roles[0].name.replace("ROLE_", "");
        acc[role] = (acc[role] || 0) + 1;
      } else {
        acc["CITIZEN"] = (acc["CITIZEN"] || 0) + 1;
      }
      return acc;
    },
    { CITIZEN: 0, VOLUNTEER: 0, AUTHORITY: 0, ADMIN: 0 } as Record<string, number>
  );

  const roleDefinitions = [
    {
      role: "CITIZEN",
      desc: "Standard citizen account. File civic complaints, track resolutions in real-time, view local map coordinates, and reply to community feeds.",
      badgeColor: "bg-blue-500/10 text-blue-500",
      icon: Users,
      count: roleCounts.CITIZEN,
    },
    {
      role: "VOLUNTEER",
      desc: "Community action volunteers. Perform on-site verifications, earn gamified karma points, claim challenge badges, and coordinate local civic responses.",
      badgeColor: "bg-pink-500/10 text-pink-500",
      icon: Heart,
      count: roleCounts.VOLUNTEER,
    },
    {
      role: "AUTHORITY",
      desc: "Government department staff and field officers. Access operational workloads, update task dispatch logs, coordinate route optimization maps, and confirm civic resolutions.",
      badgeColor: "bg-amber-500/10 text-amber-500",
      icon: Landmark,
      count: roleCounts.AUTHORITY,
    },
    {
      role: "ADMIN",
      desc: "Super administration authorities. Controls platform taxonomy categories, supervises user registries, re-aligns system prompts, and monitors overall infrastructure SLA metrics.",
      badgeColor: "bg-emerald-500/10 text-emerald-500",
      icon: Shield,
      count: roleCounts.ADMIN,
    },
  ];

  return (
    <div id="admin-role-management-panel" className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-display font-bold text-zinc-900 dark:text-white text-base">
          Authority Schema Roles
        </h3>
        <p className="text-xs text-zinc-500">
          Supervise user access classes, view permission breakdowns, and review active member counts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roleDefinitions.map((roleDef) => {
          const Icon = roleDef.icon;
          return (
            <Card
              key={roleDef.role}
              className="hover:border-zinc-300 dark:hover:border-zinc-800 transition-all border border-zinc-200/50 dark:border-zinc-800/50"
            >
              <CardBody className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${roleDef.badgeColor}`}>
                      <Icon className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                        {roleDef.role} Role Authority
                      </h4>
                      <span className="text-[10px] text-zinc-400 font-mono">ROLE_{roleDef.role}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-xl">
                    {roleDef.count} Active
                  </span>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  {roleDef.desc}
                </p>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
