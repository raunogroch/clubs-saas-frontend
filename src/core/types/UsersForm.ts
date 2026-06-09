import type { Gender, Roles, Status } from "../../common";

export type UserFormInputs = {
  name: string;
  lastname: string;
  dni: string;
  username: string;

  roles: {
    role: Roles | "";
  }[];

  gender?: Gender | "";
  birthDate?: string;
  phone?: string;
  address?: string;
  status?: Status | "";
};
