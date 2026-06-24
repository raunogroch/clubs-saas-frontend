import { CoachAssignedRow } from "./CoachAssignedRow";
import { CoachNewRow } from "./CoachNewRow";
import type { User } from "../../core/interfaces";
import type { CoachRole, GroupCoach } from "../../core/interfaces/Groups";

interface SelectedCoachWithRole {
  user: User;
  role: CoachRole;
}

interface CoachAssignedListProps {
  savedCoaches: GroupCoach[];
  newCoaches: SelectedCoachWithRole[];
  coachMap: Map<string, User>;
  onChangeRoleSavedCoach: (coachId: string, role: CoachRole) => void;
  onChangeRoleNewCoach: (coachId: string, role: CoachRole) => void;
  onRemoveSavedCoach: (id: string) => void;
  onRemoveNewCoach: (coachId: string) => void;
}

/**
 * CoachAssignedList Component
 *
 * Responsabilidad única: Renderizar tabla de coaches asignados
 * SRP: Solo muestra coaches guardados y nuevos
 * DIP: Recibe todos los datos y handlers como props
 */
export const CoachAssignedList = ({
  savedCoaches,
  newCoaches,
  coachMap,
  onChangeRoleSavedCoach,
  onChangeRoleNewCoach,
  onRemoveSavedCoach,
  onRemoveNewCoach,
}: CoachAssignedListProps) => {
  const hasCoaches = savedCoaches.length > 0 || newCoaches.length > 0;

  if (!hasCoaches) {
    return (
      <div className="alert alert-light border text-center py-2">
        Sin coaches asignados
      </div>
    );
  }

  return (
    <table className="table table-sm mb-0">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Carnet</th>
          <th>Rol</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {savedCoaches.map((c) => {
          const info = coachMap.get(c.coachId);
          if (!info) return null;

          return (
            <CoachAssignedRow
              key={c.id}
              groupCoachId={c.id}
              coach={info}
              role={c.role}
              onChangeRole={onChangeRoleSavedCoach}
              onRemove={onRemoveSavedCoach}
            />
          );
        })}

        {newCoaches.map((c) => (
          <CoachNewRow
            key={`draft-${c.user.id}`}
            coach={c.user}
            role={c.role}
            onChangeRole={onChangeRoleNewCoach}
            onRemove={onRemoveNewCoach}
          />
        ))}
      </tbody>
    </table>
  );
};
