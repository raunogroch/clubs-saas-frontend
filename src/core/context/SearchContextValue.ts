import { createContext } from "react";

export interface SearchContextType {
  searchValue: string;
  setSearchValue: (value: string) => void;
  isSearchEnabled: boolean;
  setIsSearchEnabled: (enabled: boolean) => void;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined,
);
