import { useCallback } from "react";
import {
  useCreateClubMutation,
  useDeleteClubMutation,
  useGetClubsQuery,
  useUpdateClubMutation,
} from "./clubApi";
import type {
  Club,
  CreateClubDto,
  UpdateClubDto,
} from "../../core/interfaces/Clubs";

interface UseClubsParams {
  page?: number;
  limit?: number;
  search?: string;
  assignmentId?: string;
}

export const useClubs = (params?: UseClubsParams) => {
  const queryParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
    search: params?.search,
  };

  const { data, isLoading, error, refetch } = useGetClubsQuery(queryParams);

  const filteredClubs = (data?.data ?? []).filter((club) => {
    const assignmentId = params?.assignmentId?.trim();

    if (!assignmentId) {
      return true;
    }

    return club.assignmentId === assignmentId;
  });

  return {
    clubs: filteredClubs,
    meta: data?.meta,
    isLoading,
    error: error ? "No se pudieron cargar los clubes" : null,
    refetch,
    isEmpty: !isLoading && (!data?.data || data.data.length === 0),
  };
};

export const useCreateClub = () => {
  const [createClubMutation, { isLoading, error }] = useCreateClubMutation();

  const createClub = useCallback(
    async (club: CreateClubDto) => {
      return await createClubMutation(club).unwrap();
    },
    [createClubMutation],
  );

  return {
    createClub,
    isLoading,
    error: error ? "No se pudo crear el club" : null,
  };
};

export const useUpdateClub = () => {
  const [updateClubMutation, { isLoading, error }] = useUpdateClubMutation();

  const updateClub = useCallback(
    async (club: UpdateClubDto) => {
      return await updateClubMutation(club).unwrap();
    },
    [updateClubMutation],
  );

  return {
    updateClub,
    isLoading,
    error: error ? "No se pudo actualizar el club" : null,
  };
};

export const useDeleteClub = () => {
  const [deleteClubMutation, { isLoading, error }] = useDeleteClubMutation();

  const deleteClub = useCallback(
    async (id: string) => {
      return await deleteClubMutation(id).unwrap();
    },
    [deleteClubMutation],
  );

  return {
    deleteClub,
    isLoading,
    error: error ? "No se pudo eliminar el club" : null,
  };
};

export const useClubById = (id: string | undefined) => {
  const { clubs, isLoading } = useClubs();

  const club = clubs.find((item: Club) => item.id === id);

  return {
    club,
    isLoading,
    found: Boolean(club),
  };
};
