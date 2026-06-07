import { createContext, useContext, useState, type ReactNode } from "react";

interface SearchContextType {
  searchValue: string;
  setSearchValue: (value: string) => void;
  isSearchEnabled: boolean;
  setIsSearchEnabled: (enabled: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        searchValue,
        setSearchValue,
        isSearchEnabled,
        setIsSearchEnabled,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch debe usarse dentro de SearchProvider");
  }
  return context;
};
