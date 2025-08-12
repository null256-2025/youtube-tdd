"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

export type ResultItem = { id: string; title: string };

export type AppState = {
  searchQuery: string;
  results: ResultItem[];
  isLoading: boolean;
  errorMessage: string | null;
  setSearchQuery: (q: string) => void;
  setResults: (items: ResultItem[]) => void;
  setIsLoading: (loading: boolean) => void;
  setErrorMessage: (msg: string | null) => void;
  resetResults: () => void;
};

const AppStoreContext = createContext<AppState | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const value: AppState = useMemo(
    () => ({
      searchQuery,
      results,
      isLoading,
      errorMessage,
      setSearchQuery,
      setResults,
      setIsLoading,
      setErrorMessage,
      resetResults: () => setResults([]),
    }),
    [searchQuery, results, isLoading, errorMessage]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore<T>(selector: (s: AppState) => T): T {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return selector(store);
}
