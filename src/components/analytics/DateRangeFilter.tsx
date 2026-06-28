import React from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";

export type DateRangeType = "7d" | "30d" | "90d" | "ytd" | "custom";

interface DateRangeFilterProps {
  selectedRange: DateRangeType;
  onChange: (range: DateRangeType) => void;
  startDate?: string;
  endDate?: string;
  onCustomDateChange?: (start: string, end: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  selectedRange,
  onChange,
  startDate,
  endDate,
  onCustomDateChange
}) => {
  const ranges: { value: DateRangeType; label: string }[] = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 30 Days" }, // Standardized label
    { value: "ytd", label: "Year to Date" },
    { value: "custom", label: "Custom Range" }
  ];

  // Adjust label for "90d" to show "Last 90 Days" in actual text, keeping "30d" label as "Last 30 Days"
  ranges[2].label = "Last 90 Days";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200/55 dark:border-zinc-800/55 shadow-sm">
      <div className="flex flex-wrap gap-1">
        {ranges.map((range) => (
          <button
            key={range.value}
            id={`btn-range-${range.value}`}
            onClick={() => onChange(range.value)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
              selectedRange === range.value
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {selectedRange === "custom" && (
        <div className="flex items-center gap-2 px-2 border-t sm:border-t-0 sm:border-l border-zinc-100 dark:border-zinc-800/80 pt-2 sm:pt-0 sm:pl-3">
          <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            type="date"
            id="input-start-date"
            value={startDate || ""}
            onChange={(e) => onCustomDateChange?.(e.target.value, endDate || "")}
            className="bg-transparent text-xs font-medium text-zinc-700 dark:text-zinc-300 outline-none border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 focus:border-emerald-500"
          />
          <span className="text-zinc-400 text-xs">to</span>
          <input
            type="date"
            id="input-end-date"
            value={endDate || ""}
            onChange={(e) => onCustomDateChange?.(startDate || "", e.target.value)}
            className="bg-transparent text-xs font-medium text-zinc-700 dark:text-zinc-300 outline-none border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 focus:border-emerald-500"
          />
        </div>
      )}
    </div>
  );
};
