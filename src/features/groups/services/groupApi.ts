import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "../../../app/baseQueryWithAuth";
import type {
  Group,
  GroupListResponse,
  CreateGroupDto,
  CoachRole,
  GroupStatus,
  GroupSchedule,
  CreateGroupScheduleDto,
  GroupCoach,
  Enrollment,
  GroupEnrollmentPayload,
  CreateEnrollmentDto,
  UpdateEnrollmentDto,
} from "../../../core/interfaces/Groups";

const api = createApi({
  reducerPath: "groupApi",
  tagTypes: [
    "Groups",
    "GroupsByClub",
    "GroupCoaches",
    "GroupSchedules",
    "GroupEnrollments",
  ],
  baseQuery: createBaseQueryWithAuth(
    import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  ),
  endpoints: (builder) => ({
    getGroups: builder.query<
      GroupListResponse,
      { page?: number; limit?: number; clubId?: string }
    >({
      query: (args) => {
        const params = new URLSearchParams();

        if (args?.clubId?.trim()) {
          params.append("clubId", args.clubId);
        }

        const page = args?.page ?? 1;
        const limit = args?.limit ?? 10;

        params.append("page", page.toString());
        params.append("limit", limit.toString());

        return {
          url: `/groups?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, arg) => [
        "Groups",
        { type: "GroupsByClub", id: arg?.clubId || "all" },
      ],
    }),

    getGroup: builder.query<Group, string>({
      query: (groupId) => ({
        url: `/groups/${groupId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, _groupId) => {
        void _result;
        void _error;
        void _groupId;
        return [{ type: "GroupsByClub", id: "all" }, "Groups"];
      },
    }),

    createGroup: builder.mutation<Group, CreateGroupDto>({
      query: (body) => ({
        url: "/groups",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "GroupsByClub", id: arg.clubId },
        "Groups",
      ],
    }),

    updateGroup: builder.mutation<
      Group,
      {
        id: string;
        name?: string;
        description?: string | null;
        clubId?: string;
        assignmentId?: string;
        address?: string | null;
        maxAthletes?: number | null;
        minAge?: number | null;
        maxAge?: number | null;
        status?: GroupStatus;
        coaches?: Array<{ coachId: string; role: CoachRole }> | string[];
        schedules?: Array<GroupSchedule | CreateGroupScheduleDto>;
      }
    >({
      query: (body) => ({
        url: `/groups/${body.id}`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "GroupsByClub", id: arg.clubId || "all" },
        "Groups",
      ],
    }),

    deleteGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Groups", "GroupsByClub"],
    }),

    // ---- Group relations endpoints ----
    getGroupCoaches: builder.query<GroupCoach[], string>({
      query: (groupId) => ({
        url: `/groups/${groupId}/coaches`,
        method: "GET",
      }),
      providesTags: (_result, _error, groupId) => [
        { type: "GroupCoaches", id: groupId },
      ],
    }),

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

    getGroupSchedules: builder.query<GroupSchedule[], string>({
      query: (groupId) => ({
        url: `/groups/${groupId}/schedules`,
        method: "GET",
      }),
      providesTags: (_result, _error, groupId) => [
        { type: "GroupSchedules", id: groupId },
      ],
    }),

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

    getGroupEnrollments: builder.query<Enrollment[], string>({
      query: (groupId) => ({
        url: `/groups/${groupId}/enrollments`,
        method: "GET",
      }),
      providesTags: (_result, _error, groupId) => [
        { type: "GroupEnrollments", id: groupId },
      ],
    }),

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
          api.util.updateQueryData("getGroup", groupId, (draft) => {
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
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,

  useGetGroupCoachesQuery,
  useRemoveGroupCoachMutation,
  useGetGroupSchedulesQuery,
  useDeleteGroupScheduleMutation,
  useGetGroupEnrollmentsQuery,
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
} = api;

export const groupApi = api;
export default api;
