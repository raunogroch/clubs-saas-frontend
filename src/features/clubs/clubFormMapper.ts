import type { Club } from "../../core/interfaces/Clubs";

export interface ClubFormInputs {
  name: string;
  image: string;
  sport: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  assignmentId: string;
  status: string;
}

export const emptyForm: ClubFormInputs = {
  name: "",
  image: "",
  sport: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  assignmentId: "",
  status: "ACTIVE",
};

export const mapClubToForm = (club?: Club): ClubFormInputs => {
  if (!club) return emptyForm;

  return {
    name: club.name ?? "",
    image: club.image ?? "",
    sport: club.sport ?? "",
    phone: club.phone ?? "",
    address: club.address ?? "",
    city: club.city ?? "",
    country: club.country ?? "",
    assignmentId: club.assignmentId ?? "",
    status: club.status ?? "ACTIVE",
  };
};
