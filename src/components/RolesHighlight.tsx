import { LabelHighlight } from "./LabelHighlight";

import { getRoleLabel } from "../common/translations";

import type { UserRole } from "../features/users/userApi";

interface RolesHighlightProps {
  roles?: UserRole[];
}

export const RolesHighlight = ({ roles = [] }: RolesHighlightProps) => {
  if (roles.length === 0) {
    return <span className="text-muted">Sin roles</span>;
  }

  return (
    <>
      {roles.map((userRole) => (
        <div key={userRole.id} className="mb-1">
          <LabelHighlight
            text={getRoleLabel(userRole.role)}
            type="info"
            location="center"
          />
        </div>
      ))}
    </>
  );
};
