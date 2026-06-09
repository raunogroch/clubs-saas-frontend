import { useMemo } from "react";
import { useUsers } from "../../features/users/userHooks";
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

  const getOwnerNames = (owners?: string[] | any[]): string[] => {
    if (!owners || owners.length === 0) return [];

    return owners
      .map((owner) => {
        const userId = typeof owner === "string" ? owner : owner.userId;
        return userNameMap[userId];
      })
      .filter(Boolean);
  };

  const hasOwners = (owners?: string[] | any[]): boolean => {
    return getOwnerNames(owners).length > 0;
  };

  return {
    allAdminUsers,
    userNameMap,
    getOwnerNames,
    hasOwners,
  };
};
