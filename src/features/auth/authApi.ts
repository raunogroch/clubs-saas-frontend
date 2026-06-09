// features/auth/authApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { LoginRequest, LoginResponse } from "../../core/interfaces";

const api = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    validateToken: builder.query<{ valid: boolean }, void>({
      query: () => ({
        url: "/auth/validate",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useValidateTokenQuery } = api;
export const authApi = api;
export default api;

// Re-export tipo para compatibilidad hacia atrás
export type { LoginResponse };
