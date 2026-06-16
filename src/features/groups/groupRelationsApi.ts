import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "../../app/baseQueryWithAuth";
import type {
  GroupCoach,
  GroupSchedule,
  Enrollment,
  CreateEnrollmentDto,
  UpdateEnrollmentDto,
} from "../../core/interfaces/Groups";

/**
 * API para operaciones relacionadas con Grupos:
 * - Coaches (GroupCoach)
 * - Schedules (GroupSchedule)
 * - Enrollments (Athletes)
 *
 * Mantiene SOLID: cada endpoint está separado por responsabilidad
 */
const api = createApi({
  reducerPath: "groupRelationsApi",
  tagTypes: ["GroupCoaches", "GroupSchedules", "GroupEnrollments"],
  baseQuery: createBaseQueryWithAuth(
    import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  ),
  endpoints: (builder) => ({
    // ============ GROUP COACHES ============
    /**
     * GET /groups/:groupId/coaches
     * Obtiene todos los coaches de un grupo
     */
    getGroupCoaches: builder.query<GroupCoach[], string>({
      query: (groupId) => ({
        url: `/groups/${groupId}/coaches`,
        method: "GET",
      }),
      providesTags: (_result, _error, groupId) => [
        { type: "GroupCoaches", id: groupId },
      ],
    }),

    /**
     * DELETE /groups/:groupId/coaches/:coachId
     * Elimina un coach de un grupo
     */
    removeGroupCoach: builder.mutation<
      void,
      { groupId: string; coachId: string }
    >({
      query: ({ groupId, coachId }) => ({
        url: `/groups/${groupId}/coaches/${coachId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { groupId }) => [
        { type: "GroupCoaches", id: groupId },
      ],
    }),

    // ============ GROUP SCHEDULES ============
    /**
     * GET /groups/:groupId/schedules
     * Obtiene todos los horarios de un grupo
     */
    getGroupSchedules: builder.query<GroupSchedule[], string>({
      query: (groupId) => ({
        url: `/groups/${groupId}/schedules`,
        method: "GET",
      }),
      providesTags: (_result, _error, groupId) => [
        { type: "GroupSchedules", id: groupId },
      ],
    }),

    /**
     * DELETE /groups/:groupId/schedules/:scheduleId
     * Elimina un horario de un grupo
     */
    deleteGroupSchedule: builder.mutation<
      void,
      { groupId: string; scheduleId: string }
    >({
      query: ({ groupId, scheduleId }) => ({
        url: `/groups/${groupId}/schedules/${scheduleId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { groupId }) => [
        { type: "GroupSchedules", id: groupId },
      ],
    }),

    // ============ GROUP ENROLLMENTS ============
    /**
     * GET /groups/:groupId/enrollments
     * Obtiene todos los atletas inscritos en un grupo
     */
    getGroupEnrollments: builder.query<Enrollment[], string>({
      query: (groupId) => ({
        url: `/groups/${groupId}/enrollments`,
        method: "GET",
      }),
      providesTags: (_result, _error, groupId) => [
        { type: "GroupEnrollments", id: groupId },
      ],
    }),

    /**
     * POST /groups/:groupId/enrollments
     * Inscribe un atleta en un grupo
     */
    createEnrollment: builder.mutation<
      Enrollment,
      { groupId: string; data: CreateEnrollmentDto }
    >({
      query: ({ groupId, data }) => ({
        url: `/groups/${groupId}/enrollments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { groupId }) => [
        { type: "GroupEnrollments", id: groupId },
      ],
    }),

    /**
     * PATCH /groups/:groupId/enrollments/:enrollmentId
     * Actualiza la inscripción de un atleta
     */
    updateEnrollment: builder.mutation<
      Enrollment,
      { groupId: string; enrollmentId: string; data: UpdateEnrollmentDto }
    >({
      query: ({ groupId, enrollmentId, data }) => ({
        url: `/groups/${groupId}/enrollments/${enrollmentId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { groupId }) => [
        { type: "GroupEnrollments", id: groupId },
      ],
    }),

    /**
     * DELETE /groups/:groupId/enrollments/:enrollmentId
     * Elimina la inscripción de un atleta
     */
    deleteEnrollment: builder.mutation<
      void,
      { groupId: string; enrollmentId: string }
    >({
      query: ({ groupId, enrollmentId }) => ({
        url: `/groups/${groupId}/enrollments/${enrollmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { groupId }) => [
        { type: "GroupEnrollments", id: groupId },
      ],
    }),
  }),
});

export const {
  useGetGroupCoachesQuery,
  useRemoveGroupCoachMutation,
  useGetGroupSchedulesQuery,
  useDeleteGroupScheduleMutation,
  useGetGroupEnrollmentsQuery,
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
} = api;

export const groupRelationsApi = api;
export default api;
