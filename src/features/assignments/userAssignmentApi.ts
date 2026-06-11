import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQueryWithAuth } from "../../app/baseQueryWithAuth";
import type { UserAssignments } from "../../core/interfaces";

export const userAssignmentApi = createApi({
  reducerPath: "userAssignmentApi",
  tagTypes: ["UserAssignments"],
  baseQuery: createBaseQueryWithAuth(
    import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  ),
  endpoints: (builder) => ({
    getCurrentUserAssignments: builder.query<UserAssignments[], string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        const candidate =
          typeof response === "object" && response !== null
            ? ((
                response as {
                  user?: { assignments?: UserAssignments[] };
                  assignments?: UserAssignments[];
                }
              ).user ??
              (response as { data?: { assignments?: UserAssignments[] } })
                .data ??
              response)
            : null;

        return (
          (candidate as { assignments?: UserAssignments[] })?.assignments ?? []
        );
      },
      providesTags: (_result, _error, userId) => [
        { type: "UserAssignments", id: userId },
      ],
    }),
  }),
});

export const {
  useGetCurrentUserAssignmentsQuery,
  useLazyGetCurrentUserAssignmentsQuery,
} = userAssignmentApi;

export default userAssignmentApi;
