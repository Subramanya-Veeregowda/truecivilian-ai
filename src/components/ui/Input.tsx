import React, { useId } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = "",
  type = "text",
  disabled,
  ...props
}) => {
  const id = useId();

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
        
        <input
          id={id}
          type={type}
          disabled={disabled}
          className={`w-full text-sm rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 ${
            Icon ? "pl-11" : "px-4"
          } py-2.5 ${
            error 
              ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500" 
              : "hover:border-zinc-300 dark:hover:border-zinc-700"
          } ${disabled ? "opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-950" : ""} ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  className = "",
  disabled,
  rows = 4,
  ...props
}) => {
  const id = useId();

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      
      <textarea
        id={id}
        rows={rows}
        disabled={disabled}
        className={`w-full text-sm rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 px-4 py-2.5 ${
          error 
            ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500" 
            : "hover:border-zinc-300 dark:hover:border-zinc-700"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-950" : ""} ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  className = "",
  disabled,
  ...props
}) => {
  const id = useId();

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      
      <select
        id={id}
        disabled={disabled}
        className={`w-full text-sm rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-200 px-4 py-2.5 ${
          error 
            ? "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500" 
            : "hover:border-zinc-300 dark:hover:border-zinc-700"
        } ${disabled ? "opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-950" : ""} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
