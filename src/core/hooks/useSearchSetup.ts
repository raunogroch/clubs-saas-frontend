import { useEffect } from "react";
import { useSearch } from "../context/SearchContext";

export const useSearchSetup = () => {
  const { searchValue, setSearchValue, setIsSearchEnabled } = useSearch();

  useEffect(() => {
    setIsSearchEnabled(true);
    return () => {
      setIsSearchEnabled(false);
      setSearchValue("");
    };
  }, [setIsSearchEnabled, setSearchValue]);

  return { searchValue, setSearchValue };
};
