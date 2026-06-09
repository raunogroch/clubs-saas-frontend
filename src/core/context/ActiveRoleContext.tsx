import { createContext, useContext, type ReactNode } from "react";
import type { Roles } from "../../common/enums";
import { useRolePersistence } from "../hooks/useRolePersistence";

interface ActiveRoleContextType {
  activeRole: Roles | undefined;
  setActiveRole: (role: Roles) => void;
  isHydrated: boolean;
}

const ActiveRoleContext = createContext<ActiveRoleContextType | undefined>(
  undefined,
);

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

export const useActiveRole = () => {
  const context = useContext(ActiveRoleContext);
  if (context === undefined) {
    throw new Error("useActiveRole debe usarse dentro de ActiveRoleProvider");
  }
  return context;
};
