import { useEffect, useCallback } from "react";
import { useOwnerSearch } from "../core/hooks/useOwnerSearch";
import type { AssignmentModalProps } from "../core/interfaces";

export const useModalInitialization = (
  open: boolean,
  data: AssignmentModalProps["data"],
) => {
  const ownerSearch = useOwnerSearch();
  const { initializeOwners, loadSelectedUsers, owners } = ownerSearch;

  useEffect(() => {
    if (open) {
      initializeOwners(data);
    }
  }, [open, data, initializeOwners]);

  useEffect(() => {
    if (owners.length > 0) {
      loadSelectedUsers();
    }
  }, [owners, loadSelectedUsers]);

  const handleClose = useCallback(() => {
    initializeOwners();
  }, [initializeOwners]);

  return {
    ownerSearch,
    handleClose,
  };
};
