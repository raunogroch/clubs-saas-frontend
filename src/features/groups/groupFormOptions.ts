import { Status } from "../../common/enums";
import { statusLabels } from "../../common/translations";

export const statusOptions = Object.values(Status).map((value) => ({
  value,
  label: statusLabels[value as keyof typeof statusLabels] ?? value,
}));
