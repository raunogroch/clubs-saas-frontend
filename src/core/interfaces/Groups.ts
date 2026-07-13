import { Status } from "../../common/enums";

export type GroupStatus = (typeof Status)[keyof typeof Status];

// ============ ENUMS (as Type Unions) ============
export type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type EnrollmentStatus =
  | "ACTIVE"
  | "PENDING"
  | "SUSPENDED"
  | "WITHDRAWN"
  | "COMPLETED";

export type CoachRole = "HEAD_COACH" | "ASSISTANT_COACH";

// ============ COACH INTERFACES ============
export interface Coach {
  id: string;
  name: string;
  email: string;
}

export interface GroupCoach {
  id: string;
  groupId: string;
  coachId: string;
  role?: CoachRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGroupCoachDto {
  coachId: string;
  role?: CoachRole;
}

export interface UpdateGroupCoachDto extends CreateGroupCoachDto {
  id: string;
}

// ============ SCHEDULE INTERFACES ============
export interface GroupSchedule {
  id: string;
  groupId: string;
  day: WeekDay;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGroupScheduleDto {
  day: WeekDay;
  startTime: string;
  endTime: string;
}

export interface UpdateGroupScheduleDto extends CreateGroupScheduleDto {
  id: string;
}

// ============ ENROLLMENT INTERFACES ============
export interface Athlete {
  id: string;
  name: string;
  lastname?: string;
  username?: string;
  dni?: string;
  email?: string;
  gender?: string;
  birthDate?: string;
  phone?: string;
  address?: string;
}

export interface Schedule {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Enrollment {
  id: string;
  groupId: string;
  athleteId: string;
  athlete?: Athlete;
  status: EnrollmentStatus;
  joinedAt?: string | null;
  leftAt?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEnrollmentDto {
  athleteId: string;
  status?: EnrollmentStatus;
  notes?: string;
}

export interface GroupEnrollmentPayload {
  id: string;
  enrollments: Array<{
    assignmentId: string;
    clubId: string;
    groupId: string;
    athleteId: string;
    status: EnrollmentStatus;
    notes?: string;
    enrollmentDate?: string;
    joinedAt?: string | null;
    leftAt?: string | null;
  }>;
}

export interface UpdateEnrollmentDto extends CreateEnrollmentDto {
  id: string;
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
  coaches?: GroupCoach[];
  schedules?: GroupSchedule[];
  enrollments?: Enrollment[];
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
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
  coaches?: string[];
  schedules?: CreateGroupScheduleDto[];
}

export interface GroupModalProps {
  open: boolean;
  onClose: () => void;
  data?: Group;
  onSaved?: () => void;
  defaultClubId?: string;
  initialTab?: "info" | "coaches" | "schedules" | "athletes";
}
