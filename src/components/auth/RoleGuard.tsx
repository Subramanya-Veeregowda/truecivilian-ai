import React from "react";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardBody } from "../ui/Card";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Check if user has any of the allowed roles
  const hasPermission = user.roles.some((r) => allowedRoles.includes(r.toUpperCase()));

  if (!hasPermission) {
    return (
      <div className="max-w-md mx-auto my-12">
        <Card className="border border-rose-500/20 bg-rose-50/5 dark:bg-rose-950/5">
          <CardHeader>
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 items-center justify-center">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-zinc-900 dark:text-white">
                Access Restriction Enforced
              </h3>
            </div>
          </CardHeader>
          <CardBody className="text-center space-y-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Your profile does not hold the clearance required to read this module.
            </p>
            <div className="p-3 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
              Clearance Required: {allowedRoles.join(", ")}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
