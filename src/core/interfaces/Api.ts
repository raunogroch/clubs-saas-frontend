/**
 * core/interfaces/Api.ts
 *
 * Interfaces centralizadas para respuestas de API
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit?: number;
  totalPages?: number;
  lastPage?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  [key: string]: unknown;
}
