import type { User } from "./User";

export interface Assignment {
  id: string;
  name: string;
  owners?: string[];
  clubs?: string[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignmentModalProps {
  open: boolean;
  onClose: () => void;
  data?: Assignment;
  onSaved?: () => void;
}

export interface AssignmentTableStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
}

export interface OwnerSearchInputProps {
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
  getOwnerNames: (owners?: string[] | any[]) => string[];
  onEdit: (assignment: Assignment) => void;
}

export interface OwnerSelectionTableProps {
  selectedUsers: User[];
  isSaving: boolean;
  onRemove: (userId: string) => void;
}

export interface OwnerSearchResultsProps {
  searchTerm: string;
  debouncedSearchTerm: string;
  isLoadingUsers: boolean;
  filteredUsers: User[];
  users: User[];
  isSaving: boolean;
  onSelectUser: (userId: string, user: User) => void;
}
