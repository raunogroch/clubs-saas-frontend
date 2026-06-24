import { ButtonForm } from "../../components";
import type { User } from "../../core/interfaces";

interface CoachSearchRowProps {
  coach: User;
  onAdd: (coach: User) => void;
}

/**
 * CoachSearchRow Component
 *
 * Responsabilidad única: Renderizar una fila de coach en resultados de búsqueda
 * SRP: Solo muestra nombre, carnet y botón de agregar
 */
export const CoachSearchRow = ({ coach, onAdd }: CoachSearchRowProps) => {
  return (
    <tr>
      <td className="align-middle">
        {coach.name} {coach.lastname}
      </td>
      <td className="align-middle">{coach.dni}</td>
      <td className="text-center">
        <ButtonForm
          className="btn btn-primary btn-sm btn-rounded"
          onClick={() => onAdd(coach)}
        >
          <i className="fa fa-plus" />
          &nbsp;Agregar
        </ButtonForm>
      </td>
    </tr>
  );
};
