/**
 * Hook de debugging para verificar el estado de la persistencia del rol
 *
 * Úsalo en cualquier componente para verificar:
 * - Qué rol está guardado en localStorage
 * - Qué rol activo tiene el contexto
 * - Si la persistencia está funcionando
 */

import { useEffect } from "react";
import { useActiveRole } from "../context/ActiveRoleContext";

export const useDebugActiveRole = () => {
  const { activeRole, setActiveRole } = useActiveRole();

  useEffect(() => {
    console.group("🔍 Debug: Active Role");
    console.log("Rol actual en contexto:", activeRole);

    try {
      const savedInStorage = localStorage.getItem("activeRole");
      console.log("Rol guardado en localStorage:", savedInStorage);
    } catch (error) {
      console.error("Error leyendo localStorage:", error);
    }

    console.log("Función setActiveRole disponible:", typeof setActiveRole);
    console.groupEnd();
  }, [activeRole, setActiveRole]);
};
