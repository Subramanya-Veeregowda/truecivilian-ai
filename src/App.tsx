/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider, useNotifications } from "./context/NotificationContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ShellProvider, useShell } from "./context/ShellContext";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { CommandPalette } from "./components/ui/CommandPalette";

// Import Layout Shells
import { Shell as PublicLayout } from "./components/layout/Shell";
import { AuthenticatedLayout } from "./components/layout/AuthenticatedLayout";

// Import Custom State Layouts
import { LoadingLayout } from "./components/layout/states/LoadingLayout";
import { ErrorLayout } from "./components/layout/states/ErrorLayout";
import { Page404 } from "./components/layout/states/Page404";
import { MaintenancePage } from "./components/layout/states/MaintenancePage";
import { AuthenticatedWorkspaceView } from "./components/layout/states/AuthenticatedWorkspaceView";

// Import Authentication Context & Pages
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { ResetPassword } from "./components/auth/ResetPassword";

// Import Reusable Elements
import { ToastContainer, ToastItem, ToastType } from "./components/ui/Toast";
import { Modal } from "./components/ui/Modal";
import { Button } from "./components/ui/Button";

// Import Modular Landing Components
import { HeroSection } from "./components/landing/HeroSection";
import { ProblemStatement } from "./components/landing/ProblemStatement";
import { AiFeatures } from "./components/landing/AiFeatures";
import { HowItWorks } from "./components/landing/HowItWorks";
import { CommunityStats } from "./components/landing/CommunityStats";
import { ProductHighlights } from "./components/landing/ProductHighlights";
import { ScreenshotsCarousel } from "./components/landing/ScreenshotsCarousel";
import { Testimonials } from "./components/landing/Testimonials";
import { CallToAction } from "./components/landing/CallToAction";

import { Info, Sparkles, Terminal } from "lucide-react";

function AppContent() {
  const { layout, setLayout, setRole } = useShell();

  // Toast Notification state
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const addToast = (message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Live Dialog State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handlePortalAccessTrigger = () => {
    // Transition to Auth gate
    setLayout("login");
    addToast("Redirecting to TrueCivilian Access Gate...", "info");
  };

  const handleDemoTrigger = () => {
    setIsDemoModalOpen(true);
    addToast("Buffering Demo Video Stream...", "info");
  };

  // Render correct Layout state according to Shell Context
  switch (layout) {
    case "loading":
      return <LoadingLayout />;
    
    case "error":
      return <ErrorLayout />;
    
    case "404":
      return <Page404 />;
    
    case "maintenance":
      return <MaintenancePage />;
    
    case "login":
      return (
        <ErrorBoundary>
          <PublicLayout>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <LoginPage />
          </PublicLayout>
          <CommandPalette />
        </ErrorBoundary>
      );

    case "register":
      return (
        <ErrorBoundary>
          <PublicLayout>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <RegisterPage />
          </PublicLayout>
          <CommandPalette />
        </ErrorBoundary>
      );

    case "forgot-password":
      return (
        <ErrorBoundary>
          <PublicLayout>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <ForgotPassword />
          </PublicLayout>
          <CommandPalette />
        </ErrorBoundary>
      );

    case "reset-password":
      return (
        <ErrorBoundary>
          <PublicLayout>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <ResetPassword />
          </PublicLayout>
          <CommandPalette />
        </ErrorBoundary>
      );
    
    case "authenticated":
      return (
        <ErrorBoundary>
          <ProtectedRoute>
            <AuthenticatedLayout>
              <AuthenticatedWorkspaceView />
            </AuthenticatedLayout>
          </ProtectedRoute>
          <CommandPalette />
        </ErrorBoundary>
      );

    case "landing":
    default:
      return (
        <ErrorBoundary>
          <PublicLayout>
            {/* Toast Notification Layer */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* Float Controller Indicator to help reviewers switch layouts */}
            <div className="fixed bottom-5 left-5 z-40 bg-zinc-900/90 dark:bg-zinc-950/90 backdrop-blur border border-white/10 px-4 py-3 rounded-2xl text-xs text-white shadow-xl max-w-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="font-bold tracking-wide">Developer Shell Controller</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-normal">
                Use <kbd className="bg-white/10 px-1 py-0.5 rounded font-mono">Ctrl + K</kbd> to launch Command Palette or click below to enter.
              </p>
              <div className="flex gap-1.5 pt-1">
                <button 
                  onClick={() => setLayout("authenticated")}
                  className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white transition-colors"
                >
                  Auth Shell
                </button>
                <button 
                  onClick={() => setLayout("loading")}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-zinc-300 transition-colors"
                >
                  Load State
                </button>
              </div>
            </div>

            {/* Complete Marketing Layout Workflow */}
            <div className="space-y-16 md:space-y-24 py-6">
              
              {/* 1. Hero Section */}
              <HeroSection 
                onGetStarted={handlePortalAccessTrigger} 
                onWatchVideo={handleDemoTrigger} 
              />

              {/* 2. Problem Statement */}
              <ProblemStatement />

              {/* 3. AI-Powered Features */}
              <AiFeatures />

              {/* 4. How It Works Workflow */}
              <HowItWorks />

              {/* 5. Community Statistics */}
              <CommunityStats />

              {/* 6. Product Highlights */}
              <ProductHighlights />

              {/* 7. Screenshots Carousel Mockups */}
              <ScreenshotsCarousel />

              {/* 8. User Endorsements & Testimonials */}
              <Testimonials />

              {/* 9. Final Call To Action */}
              <CallToAction onJoin={handlePortalAccessTrigger} />

            </div>

            {/* Registration Modal Dialog */}
            <Modal
              isOpen={isRegisterModalOpen}
              onClose={() => setIsRegisterModalOpen(false)}
              title="Join TrueCivilian AI Early Access"
              footerActions={
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsRegisterModalOpen(false)}>
                    Back
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => { setIsRegisterModalOpen(false); addToast("Your early access registration is recorded!", "success"); }}>
                    Confirm Registration
                  </Button>
                </>
              }
            >
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Register below to get early portal access as soon as Sprint 4 authentication, geolocation services, and Gemini integrations are active.
                </p>
                <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 border border-teal-500/10 text-xs flex items-start gap-2.5 leading-normal">
                  <Info className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <span>We will notify you immediately via email when community verification goes live in your sector.</span>
                </div>
              </div>
            </Modal>

            {/* Demo Streaming Video Modal Dialog */}
            <Modal
              isOpen={isDemoModalOpen}
              onClose={() => setIsDemoModalOpen(false)}
              title="Watch Platform Overview Video"
              footerActions={
                <Button variant="outline" size="sm" onClick={() => setIsDemoModalOpen(false)}>
                  Close Video
                </Button>
              }
            >
              <div className="space-y-4">
                {/* Aspect Ratio Video Placeholder Container */}
                <div className="aspect-video bg-zinc-900 rounded-xl flex flex-col items-center justify-center text-zinc-400 space-y-3 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
                  <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold shadow-md relative z-10">
                    ▶
                  </div>
                  <span className="text-xs font-mono relative z-10 text-zinc-300">TrueCivilian AI — Product Demo Intro Video</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center leading-normal">
                  Showing a guided walkthrough of our multi-modal categorization pipeline, spatial verification rules, and administrator management interfaces.
                </p>
              </div>
            </Modal>
          </PublicLayout>
          <CommandPalette />
        </ErrorBoundary>
      );
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <ShellProvider>
          <AuthProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </AuthProvider>
        </ShellProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
