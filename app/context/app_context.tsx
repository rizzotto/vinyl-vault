"use client";

import React from "react";

export type DataType = {
  artist: string;
  country: string;
  cover_image: string;
  format: [];
  genre: [];
  master_id: string;
  title: string;
  year: string;
};

type FilterType = {
  artist?: string;
  genre?: string;
  vinyl?: string;
};

interface AppContextValue {
  results: DataType[] | null;
  setResults: React.Dispatch<React.SetStateAction<DataType[] | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = React.createContext<AppContextValue | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [results, setResults] = React.useState<DataType[] | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [page, setPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);
  const [filters, setFilters] = React.useState<FilterType>({
    artist: undefined,
    genre: undefined,
    vinyl: undefined,
  });
  const [error, setError] = React.useState("");

  return (
    <AppContext.Provider
      value={{
        results,
        setResults,
        loading,
        setLoading,
        page,
        setPage,
        totalPages,
        setTotalPages,
        filters,
        setFilters,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
