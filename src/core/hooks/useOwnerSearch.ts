import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useUsers } from "../../features/users/userHooks";
import { Roles } from "../../common/enums";
import type { User } from "../../core/interfaces";

export const useOwnerSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [owners, setOwners] = useState<string[]>([]);
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

  const initializeOwners = useCallback(
    (data?: { owners?: Array<string | { userId?: string }> }) => {
      let ownerUserIds: string[] = [];
      if (data?.owners && data.owners.length > 0) {
        ownerUserIds = data.owners
          .map((owner) => (typeof owner === "string" ? owner : owner.userId))
          .filter((ownerId): ownerId is string => Boolean(ownerId));
      }

      setOwners(ownerUserIds);
      setSearchTerm("");
      setDebouncedSearchTerm("");
      setShowSearchResults(false);
      setSelectedUsers([]);
    },
    [],
  );

  const loadSelectedUsers = useCallback(() => {
    if (owners.length > 0) {
      const selectedFromUsers = allAdminUsers.filter((user) =>
        owners.includes(user.id),
      );
      setSelectedUsers(selectedFromUsers);
    }
  }, [owners, allAdminUsers]);

  const handleAddOwner = useCallback((userId: string, user: User) => {
    setOwners((prevOwners) => {
      if (!prevOwners.includes(userId)) {
        return [...prevOwners, userId];
      }
      return prevOwners;
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
    setOwners((prev) => prev.filter((id) => id !== userId));
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setShowSearchResults(false);
  }, []);

  const filteredUsers = useMemo(
    () => users.filter((user) => !owners.includes(user.id)),
    [users, owners],
  );

  return useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      debouncedSearchTerm,
      showSearchResults,
      setShowSearchResults,
      owners,
      selectedUsers,
      searchContainerRef,
      filteredUsers,
      isLoadingUsers,
      initializeOwners,
      loadSelectedUsers,
      handleAddOwner,
      handleRemoveOwner,
      clearSearch,
    }),
    [
      searchTerm,
      debouncedSearchTerm,
      showSearchResults,
      owners,
      selectedUsers,
      filteredUsers,
      isLoadingUsers,
      initializeOwners,
      loadSelectedUsers,
      handleAddOwner,
      handleRemoveOwner,
      clearSearch,
    ],
  );
};
