import React from "react";
import { motion } from "motion/react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "glass" | "flat" | "interactive";
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  hoverEffect = false,
  className = "",
  ...props
}) => {
  const baseClasses = "rounded-2xl border transition-all duration-300 overflow-hidden";
  
  const variantClasses = {
    default: "bg-white dark:bg-zinc-900 border-zinc-200/55 dark:border-zinc-800/55 shadow-sm",
    glass: "backdrop-blur-md bg-white/70 dark:bg-zinc-900/65 border-zinc-200/40 dark:border-zinc-800/40 shadow-sm",
    flat: "bg-zinc-50 dark:bg-zinc-950 border-zinc-200/40 dark:border-zinc-800/40",
    interactive: "bg-white dark:bg-zinc-900 border-zinc-200/55 dark:border-zinc-800/55 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 shadow-sm hover:shadow-md cursor-pointer",
  };

  const hoverClass = hoverEffect && variant !== "interactive" ? "hover:scale-[1.01] hover:shadow-md" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`px-6 py-4.5 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between gap-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between gap-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
