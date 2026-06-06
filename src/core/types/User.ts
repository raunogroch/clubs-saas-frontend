/**
 * core/types/User.ts
 *
 * Tipos centralizados para Usuario
 * Única fuente de verdad para la estructura de User en toda la app
 *
 * Principio SOLID aplicado:
 * - DIP: Componentes dependen de esta interfaz, no de su implementación
 * - SRP: Un solo lugar para definir qué es un User
 */

export interface User {
  id: string;
  name: string;
  lastname: string;
  username: string;
  email?: string;
  roles: string[];
  permissions?: string[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  name: string;
  lastname: string;
  username: string;
  email?: string;
  roles: string[];
  password?: string;
}

export interface UpdateUserInput {
  name?: string;
  lastname?: string;
  email?: string;
  roles?: string[];
  avatar?: string;
}

export interface UserListResponse {
  data: User[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
