"use client";

import React from "react";

export type DataType = {
  master_id: string;
  cover_image: string;
  title: string;
  artist: string;
  country: string;
  genre: [];
  year: string;
};

interface AppContextValue {
  results: DataType[];
  setResults: React.Dispatch<React.SetStateAction<DataType[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = React.createContext<AppContextValue | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [results, setResults] = React.useState<DataType[]>([
    {
      master_id: "initial",
      cover_image: "initial",
      title: "initial",
      artist: "initial",
      country: "initial",
      genre: [],
      year: "initial",
    },
  ]);
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <AppContext.Provider value={{ results, setResults, loading, setLoading }}>
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
