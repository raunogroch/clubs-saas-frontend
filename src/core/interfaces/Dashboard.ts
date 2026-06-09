import type { UserRole } from "./User";

export interface MenuProfileProps {
  imageUrl: string;
  name: string;
  roles: UserRole[];
}
