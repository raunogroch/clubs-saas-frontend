import { useEffect } from "react";
import { useSearch } from "../context/useSearch";

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
