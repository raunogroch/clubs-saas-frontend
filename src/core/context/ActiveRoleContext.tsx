import { createContext, useContext, useState, type ReactNode } from "react";
import type { Roles } from "../../common";

interface ActiveRoleContextType {
  activeRole: Roles | undefined;
  setActiveRole: (role: Roles) => void;
}

const ActiveRoleContext = createContext<ActiveRoleContextType | undefined>(
  undefined,
);

export const ActiveRoleProvider = ({ children }: { children: ReactNode }) => {
  const [activeRole, setActiveRole] = useState<Roles | undefined>();

  return (
    <ActiveRoleContext.Provider
      value={{
        activeRole,
        setActiveRole,
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
