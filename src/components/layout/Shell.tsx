import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useShell } from "../../context/ShellContext";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Map, 
  LayoutDashboard, 
  Compass, 
  PlusCircle, 
  User, 
  Shield, 
  Trophy, 
  AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { setLayout } = useShell();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Home Feed", icon: Compass, active: true },
    { name: "Interactive Map", icon: Map, active: false },
    { name: "Report Issue", icon: PlusCircle, active: false },
    { name: "Leaderboard", icon: Trophy, active: false },
    { name: "Authority Board", icon: LayoutDashboard, active: false },
    { name: "System Admin", icon: Shield, active: false },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 font-sans flex flex-col">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200/50 dark:border-zinc-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo / Branding */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              TC
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                TrueCivilian
              </span>
              <span className="ml-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md">
                AI
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    item.active
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Utility Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-all text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Emergency Mode Callout */}
            <button className="hidden sm:flex items-center space-x-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/30 dark:border-rose-900/30 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all">
              <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
              <span>EMERGENCY</span>
            </button>

            {/* User Profile Shortcut */}
            <button 
              onClick={() => setLayout("login")}
              className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all"
              title="Sign In to Portal"
            >
              <User className="h-4 w-4" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 px-4 pt-2 pb-4 space-y-1 shadow-lg z-30"
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
            
            {/* Mobile Emergency Button */}
            <button className="w-full flex items-center justify-center space-x-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/30 dark:border-rose-900/30 py-3 rounded-xl text-sm font-semibold tracking-wide">
              <AlertTriangle className="h-4 w-4 animate-pulse" />
              <span>EMERGENCY ONE-TAP</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Professional Footer */}
      <footer className="mt-auto border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-zinc-800 dark:text-zinc-300">TrueCivilian AI</span>
            <span>•</span>
            <span>Empowering Communities Through AI-Driven Civic Action</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium">Sprint 1 Stack Active</span>
            </span>
            <span>•</span>
            <span>PostgreSQL & Spring Boot Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
