import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "../../app/baseQueryWithAuth";
import { groupApi } from "./groupApi";
import type {
  GroupCoach,
  GroupSchedule,
  Enrollment,
  CreateEnrollmentDto,
  GroupEnrollmentPayload,
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
  tagTypes: [
    "GroupCoaches",
    "GroupSchedules",
    "GroupEnrollments",
    "Groups",
    "GroupsByClub",
  ],
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
     * POST /groups/:groupId
     * Inscribe un atleta en un grupo
     */
    createEnrollment: builder.mutation<
      Enrollment,
      { groupId: string; data: GroupEnrollmentPayload | CreateEnrollmentDto }
    >({
      async onQueryStarted({ groupId, data }, { dispatch, queryFulfilled }) {
        const optimisticEnrollment =
          "enrollments" in data && data.enrollments?.length
            ? data.enrollments[0]
            : null;

        if (!optimisticEnrollment) {
          return;
        }

        const patchResult = dispatch(
          groupApi.util.updateQueryData("getGroup", groupId, (draft) => {
            const existingEnrollments = draft.enrollments ?? [];
            const alreadyExists = existingEnrollments.some(
              (item) => item.athleteId === optimisticEnrollment.athleteId,
            );

            if (!alreadyExists) {
              draft.enrollments = [
                ...existingEnrollments,
                {
                  id: `${groupId}-${optimisticEnrollment.athleteId}`,
                  groupId,
                  athleteId: optimisticEnrollment.athleteId,
                  status: optimisticEnrollment.status ?? "PENDING",
                  notes: optimisticEnrollment.notes ?? null,
                  joinedAt: optimisticEnrollment.joinedAt ?? null,
                  leftAt: optimisticEnrollment.leftAt ?? null,
                  createdAt:
                    optimisticEnrollment.enrollmentDate ??
                    new Date().toISOString(),
                  updatedAt:
                    optimisticEnrollment.enrollmentDate ??
                    new Date().toISOString(),
                },
              ];
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      query: ({ groupId, data }) => ({
        url: `/groups/${groupId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { groupId }) => [
        { type: "GroupEnrollments", id: groupId },
        { type: "GroupsByClub", id: "all" },
        "Groups",
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
