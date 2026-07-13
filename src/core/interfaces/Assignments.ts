import type { User } from "./User";

export type AssignmentAdministratorReference = string | { userId?: string };

export interface Assignment {
  id: string;
  name: string;
  administrators?: AssignmentAdministratorReference[];
  clubs?: string[];
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export type AssignmentModalMode = "full" | "name" | "administrators";

export interface AssignmentModalProps {
  open: boolean;
  onClose: () => void;
  data?: Assignment;
  onSaved?: () => void;
  mode?: AssignmentModalMode;
}

export interface AssignmentTableStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
}

export interface AdministratorSearchInputProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showResults: boolean;
  onFocus: () => void;
  onClear: () => void;
  disabled: boolean;
}

export interface AssignmentTableProps {
  assignments: Assignment[];
  page: number;
  pageSize: number;
  getAdministratorNames: (
    administrators?: AssignmentAdministratorReference[],
  ) => string[];
  onEdit: (assignment: Assignment) => void;
  onManageAdministrators: (assignment: Assignment) => void;
}

export interface AdministratorSelectionTableProps {
  selectedUsers: User[];
  isSaving: boolean;
  onRemove: (userId: string) => void;
}

export interface AdministratorSearchResultsProps {
  searchTerm: string;
  debouncedSearchTerm: string;
  isLoadingUsers: boolean;
  filteredUsers: User[];
  users: User[];
  isSaving: boolean;
  onSelectUser: (userId: string, user: User) => void;
}
