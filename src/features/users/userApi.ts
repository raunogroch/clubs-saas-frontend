import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "../../app/baseQueryWithAuth";
import type {
  User,
  UserRole,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponse,
} from "../../core/interfaces";

interface UserListQueryArgs {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
  assignmentId?: string;
}

const buildUsersQueryUrl = (args?: UserListQueryArgs | void) => {
  const params = new URLSearchParams();

  if (args?.role) params.append("role", args.role);
  if (args?.search) params.append("search", args.search);
  if (args?.assignmentId) {
    params.append("assignmentId", args.assignmentId);
  }

  const page = args?.page ?? 1;
  const limit = args?.limit ?? 10;

  params.append("page", page.toString());
  params.append("limit", limit.toString());

  return `/users?${params.toString()}`;
};

const api = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users"],
  baseQuery: createBaseQueryWithAuth(
    import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  ),
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, UserListQueryArgs | void>({
      query: (args) => ({
        url: buildUsersQueryUrl(args),
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Users" as const, id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    createUser: builder.mutation<User, CreateUserDto>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    updateUser: builder.mutation<User, UpdateUserDto>({
      query: (body) => ({
        url: `/users/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: "Users", id: "LIST" },
              { type: "Users", id: result.id },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    uploadProfileImage: builder.mutation<
      User,
      {
        id: string;
        base64Data: string;
        type: string;
      }
    >({
      query: ({ id, base64Data, type }) => ({
        url: `/users/upload-file/${id}`,
        method: "PATCH",
        body: {
          base64Data,
          type,
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id: "LIST" },
        { type: "Users", id },
      ],
    }),

    /**
     * Obtiene un usuario por ID con todos sus datos incluyendo assignments
     *
     * Principios SOLID:
     * - SRP: Una responsabilidad - obtener datos completos del usuario
     * - OCP: Extensible sin modificar código existente
     * - DIP: Depende del baseQuery autenticado
     */
    getUserById: builder.query<User, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [
        { type: "Users", id: userId },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUploadProfileImageMutation,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
} = api;
export const userApi = api;
export default api;

export type { User, UserRole, CreateUserDto, UpdateUserDto, PaginatedResponse };
