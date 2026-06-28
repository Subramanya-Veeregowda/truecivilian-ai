import React from "react";
import { HelpCircle, RefreshCw, AlertTriangle, Inbox } from "lucide-react";
import { motion } from "motion/react";

// 1. Loading Indicator
export const Spinner: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-5 w-5 stroke-[2.5]",
    md: "h-8 w-8 stroke-[2]",
    lg: "h-12 w-12 stroke-[1.5]",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <RefreshCw className={`animate-spin text-emerald-600 dark:text-emerald-400 ${sizeClasses[size]}`} />
    </div>
  );
};

// 2. Skeleton Loading Cards
export const SkeletonCard: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 space-y-4 bg-white dark:bg-zinc-900 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, idx) => (
          <div 
            key={idx} 
            className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded-md" 
            style={{ width: idx === rows - 1 ? "60%" : "100%" }} 
          />
        ))}
      </div>
    </div>
  );
};

// 3. Empty State Module
interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Records Found",
  description = "There are currently no items to display inside this container.",
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20 max-w-lg mx-auto">
      <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-full text-zinc-400 dark:text-zinc-500 mb-4">
        <Inbox className="h-8 w-8" />
      </div>
      <h3 className="font-display font-semibold text-zinc-900 dark:text-zinc-100 text-base">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs leading-normal">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

// 4. Error Boundary / Placeholder
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "A system exception occurred while loading this panel.",
  onRetry,
}) => {
  return (
    <div className="p-6 border border-rose-200/30 dark:border-rose-950/20 rounded-2xl bg-rose-50/20 dark:bg-rose-950/5 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left max-w-xl mx-auto">
      <div className="p-3 bg-rose-50 dark:bg-rose-950/55 rounded-xl text-rose-600 dark:text-rose-400 shrink-0">
        <AlertTriangle className="h-5.5 w-5.5" />
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-rose-900 dark:text-rose-300 text-sm">
          Initialization Failure
        </h3>
        <p className="text-xs text-rose-700/80 dark:text-rose-400/85 leading-normal">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            Click to Retry Connection
          </button>
        )}
      </div>
    </div>
  );
};

// 5. Data Table Grid Wrapper
interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="overflow-x-auto border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            {headers.map((header) => (
              <th key={header} className="px-6 py-4 font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/40 text-sm text-zinc-700 dark:text-zinc-300">
          {children}
        </tbody>
      </table>
    </div>
  );
};

// 6. Premium Responsive Mini-Chart (Visual representation)
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
}

export const CustomMiniChart: React.FC<BarChartProps> = ({ data, title }) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-3.5">
        {data.map((item) => {
          const percentage = (item.value / maxValue) * 100;
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-700 dark:text-zinc-300">{item.label}</span>
                <span className="text-zinc-900 dark:text-zinc-50 font-bold">{item.value} issues</span>
              </div>
              <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full ${item.color || "bg-emerald-500"}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
