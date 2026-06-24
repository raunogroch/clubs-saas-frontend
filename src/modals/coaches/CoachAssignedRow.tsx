import { ButtonForm } from "../../components";
import { CoachRoleSelect } from "./CoachRoleSelect";
import type { User } from "../../core/interfaces";
import type { CoachRole } from "../../core/interfaces/Groups";

interface CoachAssignedRowProps {
  groupCoachId: string;
  coach: User;
  role: CoachRole | undefined;
  onChangeRole: (coachId: string, role: CoachRole) => void;
  onRemove: (groupCoachId: string) => void;
}

/**
 * CoachAssignedRow Component
 *
 * Responsabilidad única: Renderizar fila de coach guardado con rol editable
 * SRP: Solo maneja muestra y cambios de rol/eliminación
 * DIP: Recibe handlers como props
 */
export const CoachAssignedRow = ({
  groupCoachId,
  coach,
  role,
  onChangeRole,
  onRemove,
}: CoachAssignedRowProps) => {
  return (
    <tr>
      <td className="align-middle">
        {coach.name} {coach.lastname}
      </td>
      <td className="align-middle">{coach.dni}</td>
      <td className="align-middle">
        <CoachRoleSelect
          value={role || "ASSISTANT_COACH"}
          onChange={(newRole) => onChangeRole(coach.id, newRole)}
          className="form-control form-select-sm"
        />
      </td>
      <td className="text-center">
        <ButtonForm
          className="btn btn-danger btn-sm btn-rounded"
          onClick={() => onRemove(groupCoachId)}
        >
          <i className="fa fa-trash" />
          &nbsp;Eliminar
        </ButtonForm>
      </td>
    </tr>
  );
};
