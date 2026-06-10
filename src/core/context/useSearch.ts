import { useContext } from "react";

import { SearchContext } from "./SearchContextValue";

export const useSearch = () => {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error("useSearch debe usarse dentro de SearchProvider");
  }

  return context;
};
