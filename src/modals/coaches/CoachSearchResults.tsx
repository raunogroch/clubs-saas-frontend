import { CoachSearchRow } from "./CoachSearchRow";
import type { User } from "../../core/interfaces";

interface CoachSearchResultsProps {
  coaches: User[];
  onAddCoach: (coach: User) => void;
}

/**
 * CoachSearchResults Component
 *
 * Responsabilidad única: Renderizar tabla de resultados de búsqueda
 * SRP: Solo muestra coaches disponibles
 * DIP: Recibe lista y callback como props
 */
export const CoachSearchResults = ({
  coaches,
  onAddCoach,
}: CoachSearchResultsProps) => {
  if (coaches.length === 0) {
    return (
      <div className="alert alert-light border text-center py-2 mb-0">
        No hay coincidencias
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-2">Resultados</h3>
      </div>

      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Carnet</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {coaches.map((coach) => (
            <CoachSearchRow
              key={coach.id}
              coach={coach}
              onAdd={onAddCoach}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
