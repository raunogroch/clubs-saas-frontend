import { useState, type ReactNode } from "react";

import { SearchContext } from "./SearchContextValue";

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
