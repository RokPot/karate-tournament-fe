import { z } from "node_modules/zod/lib";
import React, { createContext, ReactNode, useContext, useEffect, useMemo } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";

interface ThemeContextType {
  isDarkMode: boolean | null;
  toggleThemeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as never);

interface ThemeProviderProps {
  children: ReactNode;
}

export const initialThemeModeLocalStorage = {
  key: "initial-theme-mode",
  schema: z.boolean(),
} as const;

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { value: isDarkMode, set: setIsDarkMode, isInitialLoading } = useLocalStorage(initialThemeModeLocalStorage);

  const applyModeToApp = (darkMode: boolean | null) => {
    if (isInitialLoading) {
      return;
    }

    if (darkMode === null) {
      document.body.classList.remove("dark");
      return;
    }

    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const toggleThemeMode = () => {
    const newIsDarkMode = isDarkMode === null ? false : !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    applyModeToApp(newIsDarkMode);
  };

  useEffect(() => {
    applyModeToApp(isDarkMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode, isInitialLoading]);

  const value: ThemeContextType = useMemo(
    () => ({
      isDarkMode,
      toggleThemeMode,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDarkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeStore = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  return context;
};
