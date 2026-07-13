import { useMemo } from "react";
import { useUsers } from "../../features/users";
import { Roles } from "../../common/enums";
import type { AssignmentAdministratorReference } from "../interfaces";

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

  const getAdministratorNames = (
    administrators?: AssignmentAdministratorReference[],
  ): string[] => {
    if (!administrators || administrators.length === 0) return [];

    return administrators
      .map((administrator) => {
        const userId =
          typeof administrator === "string"
            ? administrator
            : administrator.userId;
        return userId ? userNameMap[userId] : "";
      })
      .filter(Boolean);
  };

  const hasAdministrators = (
    administrators?: AssignmentAdministratorReference[],
  ): boolean => {
    return getAdministratorNames(administrators).length > 0;
  };

  return {
    allAdminUsers,
    userNameMap,
    getAdministratorNames,
    hasAdministrators,
  };
};
