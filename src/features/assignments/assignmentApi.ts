import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "../../app/baseQueryWithAuth";

export interface Assignment {
  id: string;
  name: string;
  owners?: string[];
  clubs?: string[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<Assignment> {
  data: Assignment[];
  meta: {
    total: number;
    page: number;
    limit?: number;
    totalPages?: number;
    lastPage?: number;
  };
}

const api = createApi({
  reducerPath: "assignmentApi",
  tagTypes: ["Assignments"],
  baseQuery: createBaseQueryWithAuth(
    import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  ),
  endpoints: (builder) => ({
    getAssignments: builder.query<
      PaginatedResponse<Assignment>,
      { page?: number; limit?: number } | void
    >({
      query: (args) => {
        const page = args?.page ?? 1;
        const limit = args?.limit;
        let url = `/assignments?page=${page}&limit=${limit ?? 10}`;

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Assignments"],
    }),

    createAssignment: builder.mutation<Assignment, Omit<Assignment, "id">>({
      query: (body) => ({
        url: "/assignments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Assignments"],
    }),

    updateAssignment: builder.mutation<Assignment, Assignment>({
      query: (body) => {
        return {
          url: `/assignments/${body.id}`,
          method: "PATCH",
          body: body,
        };
      },
      invalidatesTags: ["Assignments"],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
} = api;
export const assignmentApi = api;
export default api;
