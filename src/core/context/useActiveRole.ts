import { useContext } from "react";

import { ActiveRoleContext } from "./ActiveRoleContextValue";

export const useActiveRole = () => {
  const context = useContext(ActiveRoleContext);

  if (context === undefined) {
    throw new Error("useActiveRole debe usarse dentro de ActiveRoleProvider");
  }

  return context;
};
