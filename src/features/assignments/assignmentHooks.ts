// features/assignments/assignmentHooks.ts

import { useCallback, useMemo } from "react";
import {
  useCreateAssignmentMutation,
  useGetAssignmentsQuery,
  useUpdateAssignmentMutation,
} from "./assignmentApi";
import type { Assignment } from "./assignmentApi";

/**
 * Hook para obtener todas las asignaciones
 * Maneja estado de carga, errores y caché automático
 */
export const useAssignments = (params?: { page?: number; limit?: number }) => {
  const queryParams = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
  };

  const { data, isLoading, error, refetch } =
    useGetAssignmentsQuery(queryParams);

  return {
    assignments: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    isEmpty: !isLoading && (!data?.data || data.data.length === 0),
  };
};

/**
 * Hook para crear una asignación
 * Encapsula la mutación y su estado
 */
export const useCreateAssignment = () => {
  const [createAssignment, { isLoading, error }] =
    useCreateAssignmentMutation();

  const handleCreateAssignment = useCallback(
    async (assignment: Omit<Assignment, "id">) => {
      return await createAssignment(assignment).unwrap();
    },
    [createAssignment],
  );

  return {
    createAssignment: handleCreateAssignment,
    isLoading,
    error,
  };
};

export const useUpdateAssignment = () => {
  const [updateAssignment, { isLoading, error }] =
    useUpdateAssignmentMutation();

  const handleUpdateAssignment = useCallback(
    async (assignment: Assignment) => {
      return await updateAssignment(assignment).unwrap();
    },
    [updateAssignment],
  );

  return {
    updateAssignment: handleUpdateAssignment,
    isLoading,
    error,
  };
};

/**
 * Hook para obtener una asignación por ID
 */
export const useAssignmentById = (id: string | undefined) => {
  const { assignments, isLoading } = useAssignments();

  const assignment = useMemo(
    () => assignments.find((a) => a.id === id),
    [assignments, id],
  );

  return {
    assignment,
    isLoading,
    found: !!assignment,
  };
};

/**
 * Hook para gestionar el estado de assignments
 * Proporciona acceso centralizado a todas las operaciones
 */
export const useAssignmentManager = () => {
  const { assignments, isLoading, error, refetch, isEmpty } = useAssignments();

  // Obtener estadísticas
  const stats = useMemo(
    () => ({
      total: assignments.length,
      loaded: !isLoading && assignments.length > 0,
      hasError: !!error,
      isEmpty,
    }),
    [assignments.length, isLoading, error, isEmpty],
  );

  // Buscar asignaciones por nombre (case-insensitive)
  const searchAssignments = useCallback(
    (query: string): Assignment[] => {
      if (!query.trim()) return assignments;
      return assignments.filter((a) =>
        a.name.toLowerCase().includes(query.toLowerCase()),
      );
    },
    [assignments],
  );

  return {
    assignments,
    isLoading,
    error,
    refetch,
    stats,
    searchAssignments,
  };
};

/**
 * Hook para obtener información de caché de assignments
 * Útil para debugging y monitoreo
 */
export const useAssignmentsCacheStatus = () => {
  const { assignments, isLoading } = useAssignments();

  return {
    cached: assignments.length > 0,
    count: assignments.length,
    isLoading,
    lastUpdated: new Date().toISOString(),
  };
};
