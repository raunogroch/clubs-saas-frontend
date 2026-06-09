import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "../../app/baseQueryWithAuth";
import type {
  User,
  UserRole,
  CreateUserDto,
  UpdateUserDto,
  PaginatedResponse,
} from "../../core/interfaces";

const api = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users"],
  baseQuery: createBaseQueryWithAuth(
    import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  ),
  endpoints: (builder) => ({
    getUsers: builder.query<
      PaginatedResponse<User>,
      { role?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (args) => {
        const params = new URLSearchParams();

        if (args?.role) params.append("role", args.role);
        if (args?.search) params.append("search", args.search);

        const page = args?.page ?? 1;
        const limit = args?.limit ?? 10;

        params.append("page", page.toString());
        params.append("limit", limit.toString());

        const url = `/users?${params.toString()}`;

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Users"],
    }),

    createUser: builder.mutation<User, CreateUserDto>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<User, UpdateUserDto>({
      query: (body) => ({
        url: `/users/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = api;
export const userApi = api;
export default api;

// Re-export tipos para compatibilidad hacia atrás
export type { User, UserRole, CreateUserDto, UpdateUserDto, PaginatedResponse };
