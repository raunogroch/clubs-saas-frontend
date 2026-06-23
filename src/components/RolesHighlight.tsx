import { LabelHighlight } from "./LabelHighlight";

import { getRoleLabel } from "../common/translations";

import type { Roles } from "../common/enums";

interface RolesHighlightProps {
  roles?: Roles[];
}

export const RolesHighlight = ({ roles = [] }: RolesHighlightProps) => {
  if (roles.length === 0) {
    return <span className="text-muted">Sin roles</span>;
  }

  return (
    <>
      {roles.map((role, index) => (
        <div key={index} className="mb-1">
          <LabelHighlight
            text={getRoleLabel(role)}
            type="info"
            location="center"
          />
        </div>
      ))}
    </>
  );
};
