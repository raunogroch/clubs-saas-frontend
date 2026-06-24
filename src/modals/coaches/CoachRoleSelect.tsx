import type { CoachRole } from "../../core/interfaces/Groups";

interface CoachRoleSelectProps {
  value: CoachRole;
  onChange: (role: CoachRole) => void;
  className?: string;
}

/**
 * CoachRoleSelect Component
 *
 * Responsabilidad única: Renderizar un selector de roles para coaches
 * Soporta: HEAD_COACH y ASSISTANT_COACH
 */
export const CoachRoleSelect = ({
  value,
  onChange,
  className = "form-control",
}: CoachRoleSelectProps) => {
  return (
    <select
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value as CoachRole)}
    >
      {(["HEAD_COACH", "ASSISTANT_COACH"] as const).map((role) => (
        <option key={role} value={role}>
          {role === "HEAD_COACH"
            ? "Entrenador Principal"
            : "Entrenador Asistente"}
        </option>
      ))}
    </select>
  );
};
