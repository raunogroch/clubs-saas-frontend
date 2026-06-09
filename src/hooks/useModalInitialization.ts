import { useEffect, useCallback, useMemo } from "react";
import { useOwnerSearch } from "../core/hooks/useOwnerSearch";
import type { AssignmentModalProps } from "../core/interfaces";

export const useModalInitialization = (
  open: boolean,
  data: AssignmentModalProps["data"],
) => {
  const ownerSearch = useOwnerSearch();

  // Inicializa propietarios solo cuando se abre el modal o cambian los datos
  useEffect(() => {
    if (open) {
      ownerSearch.initializeOwners(data);
    }
  }, [open, data?.id, data?.owners, ownerSearch.initializeOwners]);

  // Carga usuarios seleccionados cuando cambian los IDs de propietarios
  useEffect(() => {
    if (ownerSearch.owners.length > 0) {
      ownerSearch.loadSelectedUsers();
    }
  }, [ownerSearch.owners, ownerSearch.loadSelectedUsers]);

  const handleClose = useCallback(() => {
    ownerSearch.initializeOwners();
  }, [ownerSearch.initializeOwners]);

  // Evita que el objeto completo se reenvíe y cause re-renders innecesarios
  const memoizedOwnerSearch = useMemo(() => ownerSearch, [ownerSearch]);

  return {
    ownerSearch: memoizedOwnerSearch,
    handleClose,
  };
};
