import { useCallback } from "react";
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupsQuery,
  useUpdateGroupMutation,
} from "../services/groupApi";
import type {
  CreateGroupDto,
  UpdateGroupDto,
} from "../../../core/interfaces/Groups";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface UseGroupsParams {
  page?: number;
  limit?: number;
  clubId?: string;
}

const getErrorMessage = (error: unknown): string | null => {
  if (!error) return null;

  if (typeof error === "object" && "status" in error) {
    const fetchError = error as FetchBaseQueryError;
    switch (fetchError.status) {
      case 404:
        return "El recurso no fue encontrado";
      case 400:
        return "Datos inválidos. Verifica los campos requeridos";
      case 401:
      case 403:
        return "No tienes permisos para realizar esta acción";
      case 500:
        return "Error del servidor. Intenta más tarde";
      default:
        return null;
    }
  }

  return null;
};

export const useGroups = (params?: UseGroupsParams) => {
  const queryParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
    clubId: params?.clubId,
  };

  const skip = !params?.clubId?.trim();
  const { data, isLoading, error, refetch } = useGetGroupsQuery(queryParams, {
    skip,
  });

  return {
    groups: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error:
      getErrorMessage(error) ||
      (error ? "No se pudieron cargar los grupos" : null),
    refetch,
    isEmpty: !isLoading && (data?.data ?? []).length === 0,
  };
};

export const useCreateGroup = () => {
  const [createGroupMutation, { isLoading, error }] = useCreateGroupMutation();

  const createGroup = useCallback(
    async (group: CreateGroupDto) => {
      return await createGroupMutation(group).unwrap();
    },
    [createGroupMutation],
  );

  return {
    createGroup,
    isLoading,
    error:
      getErrorMessage(error) || (error ? "No se pudo crear el grupo" : null),
  };
};

export const useUpdateGroup = () => {
  const [updateGroupMutation, { isLoading, error }] = useUpdateGroupMutation();

  const updateGroup = useCallback(
    async (group: UpdateGroupDto) => {
      return await updateGroupMutation(group).unwrap();
    },
    [updateGroupMutation],
  );

  return {
    updateGroup,
    isLoading,
    error:
      getErrorMessage(error) ||
      (error ? "No se pudo actualizar el grupo" : null),
  };
};

export const useDeleteGroup = () => {
  const [deleteGroupMutation, { isLoading, error }] = useDeleteGroupMutation();

  const deleteGroup = useCallback(
    async (id: string) => {
      return await deleteGroupMutation(id).unwrap();
    },
    [deleteGroupMutation],
  );

  return {
    deleteGroup,
    isLoading,
    error:
      getErrorMessage(error) || (error ? "No se pudo eliminar el grupo" : null),
  };
};
