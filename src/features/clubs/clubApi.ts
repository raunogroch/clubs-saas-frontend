import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "../../app/baseQueryWithAuth";
import type {
  Club,
  ClubListResponse,
  CreateClubDto,
  UpdateClubDto,
} from "../../core/interfaces/Clubs";

const api = createApi({
  reducerPath: "clubApi",
  tagTypes: ["Clubs"],
  baseQuery: createBaseQueryWithAuth(
    import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  ),
  endpoints: (builder) => ({
    getClubs: builder.query<
      ClubListResponse,
      { page?: number; limit?: number; search?: string } | void
    >({
      query: (args) => {
        const params = new URLSearchParams();

        if (args?.search) params.append("search", args.search);

        const page = args?.page ?? 1;
        const limit = args?.limit ?? 10;

        params.append("page", page.toString());
        params.append("limit", limit.toString());

        return {
          url: `/clubs?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Clubs"],
    }),

    createClub: builder.mutation<Club, CreateClubDto>({
      query: (body) => ({
        url: "/clubs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Clubs"],
    }),

    updateClub: builder.mutation<Club, UpdateClubDto>({
      query: (body) => ({
        url: `/clubs/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Clubs"],
    }),

    deleteClub: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clubs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clubs"],
    }),
  }),
});

export const {
  useGetClubsQuery,
  useCreateClubMutation,
  useUpdateClubMutation,
  useDeleteClubMutation,
} = api;

export const clubApi = api;
export default api;
