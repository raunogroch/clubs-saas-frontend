// features/users/userHooks.ts

import { useCallback, useMemo } from "react";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "./userApi";
import type { User } from "./userApi";

/**
 * Hook para obtener todos los usuarios
 * Maneja estado de carga, errores y caché automático
 */
export const useUsers = (params?: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = {
    role: params?.role,
    search: params?.search,
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
  };

  const { data, isLoading, error, refetch } = useGetUsersQuery(queryParams);

  return {
    users: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    isEmpty: !isLoading && (!data?.data || data.data.length === 0),
  };
};

/**
 * Hook para crear un usuario
 * Encapsula la mutación y su estado
 */
export const useCreateUser = () => {
  const [createUser, { isLoading, error }] = useCreateUserMutation();

  const handleCreateUser = useCallback(
    async (user: Omit<User, "id">) => {
      return await createUser(user).unwrap();
    },
    [createUser],
  );

  return {
    createUser: handleCreateUser,
    isLoading,
    error,
  };
};

export const useUpdateUser = () => {
  const [updateUser, { isLoading, error }] = useUpdateUserMutation();

  const handleUpdateUser = useCallback(
    async (user: User) => {
      return await updateUser(user).unwrap();
    },
    [updateUser],
  );

  return {
    updateUser: handleUpdateUser,
    isLoading,
    error,
  };
};

/**
 * Hook para obtener un usuario por ID
 */
export const useUserById = (id: string | undefined) => {
  const { users, isLoading } = useUsers();

  const user = useMemo(() => users.find((u) => u.id === id), [users, id]);

  return {
    user,
    isLoading,
    found: !!user,
  };
};

/**
 * Hook para gestionar el estado de usuarios
 * Proporciona acceso centralizado a todas las operaciones
 */
export const useUserManager = () => {
  const { users, isLoading, error, refetch, isEmpty } = useUsers();
  const { createUser, isLoading: isCreating } = useCreateUser();
  const { updateUser, isLoading: isUpdating } = useUpdateUser();

  // Obtener estadísticas
  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      isLoading,
    }),
    [users.length, isLoading],
  );

  return {
    users,
    stats,
    isLoading,
    error,
    isEmpty,
    refetch,
    createUser,
    updateUser,
    isCreating,
    isUpdating,
  };
};
