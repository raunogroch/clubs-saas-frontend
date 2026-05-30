// features/auth/authApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "./authSlice";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

const api = createApi({
  reducerPath: "authApi",
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
