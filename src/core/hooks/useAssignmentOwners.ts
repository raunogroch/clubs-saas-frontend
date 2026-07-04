import { useMemo } from "react";
import { useUsers } from "../../features/users";
import { Roles } from "../../common/enums";

export const useAssignmentOwners = () => {
  const { users: allAdminUsers } = useUsers({
    role: Roles.ADMIN,
    limit: 1000,
  });

  const userNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    allAdminUsers.forEach((user) => {
      map[user.id] = `${user.lastname}, ${user.name}`;
    });
    return map;
  }, [allAdminUsers]);

  const getOwnerNames = (
    owners?: Array<string | { userId?: string }>,
  ): string[] => {
    if (!owners || owners.length === 0) return [];

    return owners
      .map((owner) => {
        const userId = typeof owner === "string" ? owner : owner.userId;
        return userId ? userNameMap[userId] : "";
      })
      .filter(Boolean);
  };

  const hasOwners = (owners?: Array<string | { userId?: string }>): boolean => {
    return getOwnerNames(owners).length > 0;
  };

  return {
    allAdminUsers,
    userNameMap,
    getOwnerNames,
    hasOwners,
  };
};
