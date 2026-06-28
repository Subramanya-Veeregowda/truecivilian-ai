import React from 'react';
import { MapFilters as FilterType } from './types';
import { SlidersHorizontal, Eye, RefreshCw, X } from 'lucide-react';

interface MapFiltersProps {
  filters: FilterType;
  onChange: (filters: FilterType) => void;
  onReset: () => void;
  departments: { id: string; name: string }[];
}

export const MapFilters: React.FC<MapFiltersProps> = ({
  filters,
  onChange,
  onReset,
  departments,
}) => {
  const handleSelectChange = (key: keyof FilterType, value: string | number) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const categories = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'road', label: 'Roads & Potholes' },
    { value: 'water', label: 'Water & Drainage' },
    { value: 'sewage', label: 'Sewage Leakage' },
    { value: 'waste', label: 'Waste & Garbage' },
    { value: 'power', label: 'Power & Electricity' },
    { value: 'public_space', label: 'Public Spaces' },
    { value: 'other', label: 'Other Hazards' },
  ];

  const statuses = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'REPORTED', label: 'Reported' },
    { value: 'VERIFIED', label: 'Verified' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
  ];

  const severities = [
    { value: 'ALL', label: 'All Severities' },
    { value: 'MINOR', label: 'Minor' },
    { value: 'MODERATE', label: 'Moderate' },
    { value: 'MAJOR', label: 'Major' },
    { value: 'CATASTROPHIC', label: 'Catastrophic' },
  ];

  const priorities = [
    { value: 'ALL', label: 'All Priorities' },
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'CRITICAL', label: 'Critical' },
  ];

  const distances = [
    { value: 5, label: 'Within 5 km' },
    { value: 10, label: 'Within 10 km' },
    { value: 20, label: 'Within 20 km' },
    { value: 50, label: 'Within 50 km' },
    { value: 999999, label: 'Any Distance' },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-2xl shadow-xl p-4 space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-emerald-500" />
          <span className="font-bold text-zinc-900 dark:text-white tracking-tight">Geospatial Filter Console</span>
        </div>
        <button
          onClick={onReset}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 font-bold font-mono text-[10px]"
        >
          <RefreshCw className="h-3 w-3" /> RESET
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Category */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[9px]">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleSelectChange('category', e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[9px]">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleSelectChange('status', e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Severity */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[9px]">Severity</label>
          <select
            value={filters.severity}
            onChange={(e) => handleSelectChange('severity', e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            {severities.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[9px]">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => handleSelectChange('priority', e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[9px]">Department</label>
          <select
            value={filters.departmentId}
            onChange={(e) => handleSelectChange('departmentId', e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Distance Radius */}
        <div className="space-y-1.5">
          <label className="font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-[9px]">Search Radius</label>
          <select
            value={filters.distanceKm}
            onChange={(e) => handleSelectChange('distanceKm', Number(e.target.value))}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl px-3 py-2 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          >
            {distances.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
