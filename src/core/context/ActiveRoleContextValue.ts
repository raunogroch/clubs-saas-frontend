import { createContext } from "react";

import type { Roles } from "../../common/enums";

export interface ActiveRoleContextType {
  activeRole: Roles | undefined;
  setActiveRole: (role: Roles) => void;
  isHydrated: boolean;
}

export const ActiveRoleContext = createContext<
  ActiveRoleContextType | undefined
>(undefined);
