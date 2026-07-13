import type { Gender, Roles, Status } from "../../common/enums";

export interface UserRole {
  id?: string;
  role: Roles;
  createdAt?: string;
}

export interface UserAssignments {
  id: string;
  userId: string;
  assignmentId: string;
  status: Status | string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

/**
 * Membership: Nueva estructura para roles del usuario con estado por rol
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - representar membresía de un usuario a un rol
 * - ISP: Interfaz específica para membresía
 */
export interface Membership {
  id?: string;
  role: Roles;
  assignmentId?: string | null;
  status?: Status | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserFile {
  id?: string;
  type?: string;
  url?: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  lastname: string;
  dni: string;
  username: string;
  password?: string;
  imageProfile?: string;
  profile_image?: string | null;
  gender?: Gender;
  birthDate?: Date;
  phone?: string;
  address?: string;
  status?: Status;
  memberships?: Membership[];
  files?: UserFile[];
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateUserDto {
  name: string;
  lastname: string;
  dni: string;
  username: string;
  password: string;
  memberships: Membership[];
  gender?: Gender;
  birthDate?: Date;
  phone?: string;
  address?: string;
  status?: Status;
}

export interface UpdateUserDto {
  id: string;
  name: string;
  lastname: string;
  dni: string;
  username: string;
  memberships: Membership[];
  gender?: Gender;
  birthDate?: Date;
  phone?: string;
  address?: string;
  status?: Status;
}

export interface UserListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
    lastPage?: number;
  };
}

export interface UserModalProps {
  open: boolean;
  onClose: () => void;
  data?: User;
  onSaved?: () => void;
  roleList?: "*" | Roles[];
  hideRoles?: boolean;
}

export interface UserPageProps {
  roleList?: "*" | Roles[];
}
