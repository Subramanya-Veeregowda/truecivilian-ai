import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorState } from "./Feedback";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const self = this as any;
    self.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught exception in component tree:", error, errorInfo);
  }

  private handleReset = () => {
    (this as any).setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    const self = this as any;
    if (self.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
          <div className="w-full max-w-lg">
            <ErrorState
              message={self.state.error?.message || "An unhandled React runtime error occurred."}
              onRetry={this.handleReset}
            />
          </div>
        </div>
      );
    }

    return self.props.children;
  }
}


