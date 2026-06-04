import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Gender, Status, Roles } from "../../common/enums";

export interface User {
  id: string;
  name: string;
  lastname: string;
  dni: string;
  username: string;
  roles: Roles[];
  gender?: Gender;
  birthDate?: Date;
  phone?: string;
  address?: string;
  status?: Status;
}

export interface PaginatedResponse<User> {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit?: number;
    totalPages?: number;
    lastPage?: number;
  };
}

const api = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users"],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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

    createUser: builder.mutation<
      User,
      Omit<User, "id"> & { password?: string }
    >({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<User, User>({
      query: (body) => {
        return {
          url: `/users/${body.id}`,
          method: "PATCH",
          body: body,
        };
      },
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
