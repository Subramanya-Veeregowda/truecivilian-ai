import React, { createContext, useContext, useState } from "react";

export type UserRole = "citizen" | "volunteer" | "authority" | "admin";
export type LayoutType = "landing" | "authenticated" | "loading" | "error" | "404" | "maintenance";

interface ShellContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  layout: LayoutType;
  setLayout: (layout: LayoutType) => void;
  currentPath: string[];
  setCurrentPath: (path: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ShellContext = createContext<ShellContextType | undefined>(undefined);

export const ShellProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("citizen");
  const [layout, setLayout] = useState<LayoutType>("landing");
  const [currentPath, setCurrentPath] = useState<string[]>(["Home"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <ShellContext.Provider
      value={{
        role,
        setRole,
        layout,
        setLayout,
        currentPath,
        setCurrentPath,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </ShellContext.Provider>
  );
};

export const useShell = () => {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within a ShellProvider");
  }
  return context;
};
