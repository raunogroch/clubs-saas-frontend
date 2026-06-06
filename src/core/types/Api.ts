/**
 * core/types/Api.ts
 *
 * Tipos genéricos para respuestas API
 * Aplicable a cualquier feature (usuarios, asignaciones, etc.)
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
  timestamp?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}
