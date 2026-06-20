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
  createdAt: string;
  updatedAt: string;
  available?: boolean | null;
}

export interface User {
  id: string;
  name: string;
  lastname: string;
  dni: string;
  username: string;
  roles: UserRole[];
  gender?: Gender;
  birthDate?: Date;
  phone?: string;
  address?: string;
  status?: Status;
  assignments?: UserAssignments[];
}

export interface CreateUserDto {
  name: string;
  lastname: string;
  dni: string;
  username: string;
  password: string;
  roles: Roles[];
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
  roles: Roles[];
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
}

export interface UserPageProps {
  roleList?: "*" | Roles[];
}
