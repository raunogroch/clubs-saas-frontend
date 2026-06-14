import { Status } from "../../common/enums";

export type GroupStatus = (typeof Status)[keyof typeof Status];

export interface Coach {
  id: string;
  name: string;
  email: string;
}

export interface Schedule {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Enrollment {
  id: string;
  athleteId: string;
  athleteName: string;
  enrollmentDate: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  assignmentId: string;
  clubId: string;
  address?: string | null;
  maxAthletes?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  status: GroupStatus;
  coaches: Coach[];
  schedules: Schedule[];
  enrollments: Enrollment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupListResponse {
  data: Group[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
    lastPage?: number;
  };
}

export interface CreateGroupDto {
  name: string;
  description?: string | null;
  assignmentId: string;
  clubId: string;
  address?: string | null;
  maxAthletes?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  status?: GroupStatus;
}

export interface UpdateGroupDto extends CreateGroupDto {
  id: string;
}

export interface GroupModalProps {
  open: boolean;
  onClose: () => void;
  data?: Group;
  onSaved?: () => void;
  defaultClubId?: string;
}
