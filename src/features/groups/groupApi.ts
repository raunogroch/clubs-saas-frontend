import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "../../app/baseQueryWithAuth";
import type {
  Group,
  GroupListResponse,
  CreateGroupDto,
} from "../../core/interfaces/Groups";

/**
 * API para operaciones CRUD de Grupos
 * - Filtra por clubId
 * - Cache separado por clubId para evitar mezclar datos
 * - Tags específicos para invalidación correcta
 */
const api = createApi({
  reducerPath: "groupApi",
  tagTypes: ["Groups", "GroupsByClub"],
  baseQuery: createBaseQueryWithAuth(
    import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  ),
  endpoints: (builder) => ({
    /**
     * GET /groups?clubId=xxx&page=x&limit=y
     * Obtiene grupos de un club específico con paginación
     */
    getGroups: builder.query<
      GroupListResponse,
      { page?: number; limit?: number; clubId?: string }
    >({
      query: (args) => {
        const params = new URLSearchParams();

        // Siempre incluir clubId si se proporciona
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
      // Cache separado por clubId para que cada club tenga sus datos
      providesTags: (_result, _error, arg) => [
        "Groups",
        { type: "GroupsByClub", id: arg?.clubId || "all" },
      ],
    }),

    /**
     * GET /groups/:id
     * Obtiene un grupo específico con sus coaches, schedules y enrollments
     */
    getGroup: builder.query<Group, string>({
      query: (groupId) => ({
        url: `/groups/${groupId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, _groupId) => [
        { type: "GroupsByClub", id: "all" },
        "Groups",
      ],
    }),

    /**
     * POST /groups
     * Crea un nuevo grupo
     */
    createGroup: builder.mutation<Group, CreateGroupDto>({
      query: (body) => ({
        url: "/groups",
        method: "POST",
        body,
      }),
      // Invalidar el cache del club específico
      invalidatesTags: (_result, _error, arg) => [
        { type: "GroupsByClub", id: arg.clubId },
        "Groups",
      ],
    }),

    /**
     * PATCH /groups/:id
     * Actualiza un grupo existente
     * Puede incluir coaches y schedules en el body
     */
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
        status?: any;
        coaches?: string[];
        schedules?: any[];
      }
    >({
      query: (body) => {
        return {
          url: `/groups/${body.id}`,
          method: "PATCH",
          body: body,
        };
      },
      // Invalidar el cache del club específico
      invalidatesTags: (_result, _error, arg) => [
        { type: "GroupsByClub", id: arg.clubId || "all" },
        "Groups",
      ],
    }),

    /**
     * DELETE /groups/:id
     * Elimina un grupo
     */
    deleteGroup: builder.mutation<void, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: "DELETE",
      }),
      // Invalidar todo el cache de grupos
      invalidatesTags: ["Groups", "GroupsByClub"],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = api;

export const groupApi = api;
export default api;
