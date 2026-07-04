import type {
  Group,
  CreateGroupScheduleDto,
} from "../../../core/interfaces/Groups";

export interface GroupFormInputs {
  name: string;
  description: string;
  clubId: string;
  address: string;
  maxAthletes: string;
  minAge: string;
  maxAge: string;
  assignmentId: string;
  status: string;
}

export interface GroupFormWithRelations extends GroupFormInputs {
  coachIds: string[];
  schedules: CreateGroupScheduleDto[];
}

export const emptyForm: GroupFormInputs = {
  name: "",
  description: "",
  clubId: "",
  address: "",
  maxAthletes: "",
  minAge: "",
  maxAge: "",
  assignmentId: "",
  status: "ACTIVE",
};

export const emptyFormWithRelations: GroupFormWithRelations = {
  ...emptyForm,
  coachIds: [],
  schedules: [],
};

export const mapGroupToForm = (group?: Group): GroupFormInputs => {
  if (!group) return emptyForm;

  return {
    name: group.name ?? "",
    description: group.description ?? "",
    clubId: group.clubId ?? "",
    address: group.address ?? "",
    maxAthletes: group.maxAthletes?.toString() ?? "",
    minAge: group.minAge?.toString() ?? "",
    maxAge: group.maxAge?.toString() ?? "",
    assignmentId: group.assignmentId ?? "",
    status: group.status ?? "ACTIVE",
  };
};
