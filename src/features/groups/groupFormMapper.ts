import type { Group } from "../../core/interfaces/Groups";

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
