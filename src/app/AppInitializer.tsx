/**
 * app/AppInitializer.tsx
 *
 * Componente que monitorea cambios de token desde otras pestañas
 *
 * setRehydrated() se dispara desde main.tsx usando onBeforeLift de PersistGate
 * Este componente solo se encarga de activar useTokenValidation()
 */

import { type ReactNode } from "react";
import { useTokenValidation } from "../hooks/useTokenValidation";

interface AppInitializerProps {
  children: ReactNode;
}

export const AppInitializer = ({ children }: AppInitializerProps) => {
  // Monitorear cambios de token desde otras pestañas (siempre, no condicionalmente)
  useTokenValidation();

  return <>{children}</>;
};
