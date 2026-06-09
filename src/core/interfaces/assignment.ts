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
