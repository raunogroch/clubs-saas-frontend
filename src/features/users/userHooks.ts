import { useCallback, useMemo } from "react";

import {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "./userApi";

import type { User, CreateUserDto, UpdateUserDto } from "./userApi";

interface UseUsersParams {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Hook para obtener lista paginada de usuarios
 *
 * Manejo automático de:
 * - Refetch en cambios de parámetros
 * - Estados de carga y error
 * - Invalidation de tags
 */
export const useUsers = (params?: UseUsersParams) => {
  const queryParams = {
    role: params?.role,
    search: params?.search,
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
  };

  const { data, isLoading, error, refetch } = useGetUsersQuery(queryParams);

  return {
    users: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error: error
      ? typeof error === "string"
        ? error
        : "Error al cargar usuarios"
      : null,
    refetch,
    isEmpty: !isLoading && (!data?.data || data.data.length === 0),
  };
};

/**
 * Hook para crear usuario
 *
 * RTK Query invalida automáticamente la caché después de éxito
 */
export const useCreateUser = () => {
  const [createUserMutation, { isLoading, error }] = useCreateUserMutation();

  const createUser = useCallback(
    async (user: CreateUserDto) => {
      return await createUserMutation(user).unwrap();
    },
    [createUserMutation],
  );

  const errorMessage = error
    ? typeof error === "string"
      ? error
      : typeof error === "object" &&
          error &&
          "status" in error &&
          error.status === 409
        ? "El usuario ya existe"
        : "Error al crear usuario"
    : null;

  return {
    createUser,
    isLoading,
    error: errorMessage,
  };
};

/**
 * Hook para actualizar usuario
 *
 * RTK Query invalida automáticamente la caché después de éxito
 */
export const useUpdateUser = () => {
  const [updateUserMutation, { isLoading, error }] = useUpdateUserMutation();

  const updateUser = useCallback(
    async (user: UpdateUserDto) => {
      return await updateUserMutation(user).unwrap();
    },
    [updateUserMutation],
  );

  const errorMessage = error
    ? typeof error === "string"
      ? error
      : typeof error === "object" &&
          error &&
          "status" in error &&
          error.status === 409
        ? "El usuario ya existe"
        : typeof error === "object" &&
            error &&
            "status" in error &&
            error.status === 404
          ? "Usuario no encontrado"
          : "Error al actualizar usuario"
    : null;

  return {
    updateUser,
    isLoading,
    error: errorMessage,
  };
};

/**
 * Hook para obtener usuario por ID desde la lista en caché
 *
 * No realiza request, solo busca en datos existentes
 */
export const useUserById = (id: string | undefined) => {
  const { users, isLoading } = useUsers();

  const user = useMemo(() => users.find((u: User) => u.id === id), [users, id]);

  return {
    user,
    isLoading,
    found: Boolean(user),
  };
};

/**
 * Hook centralizado para gestión completa de usuarios
 * Agrupa toda la lógica en un solo place
 */
export const useUserManager = (params?: UseUsersParams) => {
  const users = useUsers(params);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  return {
    ...users,
    createUser: createUser.createUser,
    isCreatingUser: createUser.isLoading,
    createUserError: createUser.error,

    updateUser: updateUser.updateUser,
    isUpdatingUser: updateUser.isLoading,
    updateUserError: updateUser.error,
  };
};
