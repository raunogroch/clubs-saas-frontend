import { useEffect, useCallback } from "react";
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
  }, [open, data, ownerSearch]);

  // Carga usuarios seleccionados cuando cambian los IDs de propietarios
  useEffect(() => {
    if (ownerSearch.owners.length > 0) {
      ownerSearch.loadSelectedUsers();
    }
  }, [ownerSearch]);

  const handleClose = useCallback(() => {
    ownerSearch.initializeOwners();
  }, [ownerSearch]);

  return {
    ownerSearch,
    handleClose,
  };
};
