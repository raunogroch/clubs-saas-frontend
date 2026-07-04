import type { User } from "../../core/interfaces";
import type { UserFormInputs } from "../../core/types";
import type { Roles } from "../../common/enums";

export const emptyForm: UserFormInputs = {
  name: "",
  lastname: "",
  dni: "",
  username: "",
  roles: [{ role: "" }],
  gender: "",
  birthDate: "",
  phone: "",
  address: "",
  status: "",
};

export const mapUserToForm = (user?: User): UserFormInputs => {
  if (!user) return emptyForm;

  return {
    name: user.name ?? "",
    lastname: user.lastname ?? "",
    dni: user.dni ?? "",
    username: user.username ?? "",

    roles:
      (user.memberships?.length ?? 0) > 0
        ? user.memberships!.map((membership) => ({
            role: membership.role as Roles,
          }))
        : [{ role: "" }],

    gender: user.gender ?? "",
    birthDate: user.birthDate
      ? new Date(user.birthDate).toISOString().split("T")[0]
      : "",
    phone: user.phone ?? "",
    address: user.address ?? "",
    status: user.status ?? "",
  };
};

export default {};
