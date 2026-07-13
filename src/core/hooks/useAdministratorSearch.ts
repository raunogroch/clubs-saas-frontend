import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useUsers } from "../../features/users";
import { Roles } from "../../common/enums";
import type { User } from "../../core/interfaces";

export const useOwnerSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [administrators, setAdministrators] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { users, isLoading: isLoadingUsers } = useUsers({
    role: Roles.ADMIN,
    search: debouncedSearchTerm,
    limit: 50,
  });

  const { users: allAdminUsers } = useUsers({
    role: Roles.ADMIN,
    limit: 1000,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showSearchResults]);

  const initializeAdministrators = useCallback(
    (data?: { administrators?: Array<string | { userId?: string }> }) => {
      let administratorUserIds: string[] = [];
      if (data?.administrators && data.administrators.length > 0) {
        administratorUserIds = data.administrators
          .map((administrator) =>
            typeof administrator === "string"
              ? administrator
              : administrator.userId,
          )
          .filter((administratorId): administratorId is string =>
            Boolean(administratorId),
          );
      }

      setAdministrators(administratorUserIds);
      setSearchTerm("");
      setDebouncedSearchTerm("");
      setShowSearchResults(false);
      setSelectedUsers([]);
    },
    [],
  );

  const loadSelectedUsers = useCallback(() => {
    if (administrators.length > 0) {
      const selectedFromUsers = allAdminUsers.filter((user) =>
        administrators.includes(user.id),
      );
      setSelectedUsers(selectedFromUsers);
    }
  }, [administrators, allAdminUsers]);

  const handleAddOwner = useCallback((userId: string, user: User) => {
    setAdministrators((prevAdministrators) => {
      if (!prevAdministrators.includes(userId)) {
        return [...prevAdministrators, userId];
      }
      return prevAdministrators;
    });
    setSelectedUsers((prev) => {
      if (!prev.find((u) => u.id === userId)) {
        return [...prev, user];
      }
      return prev;
    });
    setSearchTerm("");
  }, []);

  const handleRemoveOwner = useCallback((userId: string) => {
    setAdministrators((prev) => prev.filter((id) => id !== userId));
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setShowSearchResults(false);
  }, []);

  const filteredUsers = useMemo(
    () => users.filter((user) => !administrators.includes(user.id)),
    [users, administrators],
  );

  return useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      debouncedSearchTerm,
      showSearchResults,
      setShowSearchResults,
      owners: administrators,
      selectedUsers,
      searchContainerRef,
      filteredUsers,
      isLoadingUsers,
      initializeOwners: initializeAdministrators,
      loadSelectedUsers,
      handleAddOwner,
      handleRemoveOwner,
      clearSearch,
    }),
    [
      searchTerm,
      debouncedSearchTerm,
      showSearchResults,
      administrators,
      selectedUsers,
      filteredUsers,
      isLoadingUsers,
      initializeAdministrators,
      loadSelectedUsers,
      handleAddOwner,
      handleRemoveOwner,
      clearSearch,
    ],
  );
};
