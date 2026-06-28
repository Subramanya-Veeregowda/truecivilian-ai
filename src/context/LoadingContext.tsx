import React, { createContext, useContext, useState } from "react";

interface LoadingContextType {
  isLoading: boolean;
  setGlobalLoading: (state: boolean) => void;
  loadingMessage?: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);

  const showLoading = (message?: string) => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingMessage(undefined);
  };

  const setGlobalLoading = (state: boolean) => {
    setIsLoading(state);
    if (!state) setLoadingMessage(undefined);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setGlobalLoading, loadingMessage, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
