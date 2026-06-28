import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  // Base classes for the Button
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  // Variant styling
  const variantClasses = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-emerald-700/10 dark:bg-emerald-500 dark:hover:bg-emerald-600",
    secondary: "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-50 border border-zinc-200/40 dark:border-zinc-700/40",
    outline: "bg-transparent border border-zinc-200 hover:bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:text-zinc-300",
    ghost: "bg-transparent hover:bg-zinc-100/70 text-zinc-600 hover:text-zinc-900 dark:hover:bg-zinc-900/70 dark:text-zinc-400 dark:hover:text-white",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-rose-700/10 dark:bg-rose-500 dark:hover:bg-rose-600",
    success: "bg-teal-600 hover:bg-teal-700 text-white shadow-sm border border-teal-700/10 dark:bg-teal-500 dark:hover:bg-teal-600",
  };

  // Size styling
  const sizeClasses = {
    xs: "px-2.5 py-1.5 text-xs rounded-lg",
    sm: "px-3.5 py-2 text-xs sm:text-sm rounded-lg",
    md: "px-4.5 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3.5 text-sm sm:text-base rounded-xl",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon && iconPosition === "left" ? (
        <Icon className={`h-4 w-4 shrink-0 ${children ? "mr-2" : ""}`} />
      ) : null}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === "right" ? (
        <Icon className={`h-4 w-4 shrink-0 ${children ? "ml-2" : ""}`} />
      ) : null}
    </motion.button>
  );
};
