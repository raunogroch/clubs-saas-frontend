import { type ReactNode } from "react";

import { useRolePersistence } from "../hooks/useRolePersistence";

import { ActiveRoleContext } from "./ActiveRoleContextValue";

export const ActiveRoleProvider = ({ children }: { children: ReactNode }) => {
  const { activeRole, setActiveRole, isHydrated } =
    useRolePersistence(undefined);

  return (
    <ActiveRoleContext.Provider
      value={{
        activeRole,
        setActiveRole,
        isHydrated,
      }}
    >
      {children}
    </ActiveRoleContext.Provider>
  );
};
