import { ButtonForm } from "../../components";
import { CoachRoleSelect } from "./CoachRoleSelect";
import type { User } from "../../core/interfaces";
import type { CoachRole } from "../../core/interfaces/Groups";

interface CoachNewRowProps {
  coach: User;
  role: CoachRole;
  onChangeRole: (coachId: string, role: CoachRole) => void;
  onRemove: (coachId: string) => void;
}

/**
 * CoachNewRow Component
 *
 * Responsabilidad única: Renderizar fila de nuevo coach (draft) con rol editable
 * SRP: Solo maneja muestra de nuevos coaches con badge "Nuevo"
 * DIP: Recibe handlers como props
 */
export const CoachNewRow = ({
  coach,
  role,
  onChangeRole,
  onRemove,
}: CoachNewRowProps) => {
  return (
    <tr className="table-warning">
      <td className="align-middle">
        {coach.name} {coach.lastname}&nbsp;
        <span className="badge bg-info ms-2">Nuevo</span>
      </td>
      <td className="align-middle">{coach.dni}</td>
      <td className="align-middle">
        <CoachRoleSelect
          value={role}
          onChange={(newRole) => onChangeRole(coach.id, newRole)}
          className="form-control form-select-sm"
        />
      </td>
      <td className="text-center">
        <ButtonForm
          className="btn btn-outline-danger btn-sm btn-rounded"
          onClick={() => onRemove(coach.id)}
        >
          <i className="fa fa-trash" />
          &nbsp;Eliminar
        </ButtonForm>
      </td>
    </tr>
  );
};
