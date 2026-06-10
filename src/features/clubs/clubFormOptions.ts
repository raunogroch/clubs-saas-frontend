import { ClubStatus, Sport } from "../../common/enums";
import { sportLabels, statusClubLabels } from "../../common/translations";

export const sportOptions = Object.values(Sport).map((value) => ({
  value,
  label: sportLabels[value as keyof typeof sportLabels] ?? value,
}));

export const statusOptions = Object.values(ClubStatus).map((value) => ({
  value,
  label: statusClubLabels[value as keyof typeof statusClubLabels] ?? value,
}));
