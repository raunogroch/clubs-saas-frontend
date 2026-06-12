import { useAuthManager } from "../features/auth/useAuthManager";
import { getRoleLabel } from "../common/translations";
import { useActiveRole } from "../core/context/useActiveRole";
import { useAssignmentPersistence } from "../core/hooks";
import { useDropdownMenu } from "../core/hooks/useDropdownMenu";
import { useInitializeActiveRole } from "../core/hooks/useInitializeActiveRole";
import { useValidateRolesConsistency } from "../core/hooks/useValidateRolesConsistency";
import { useNormalizeRoles } from "../core/hooks/useNormalizeRoles";
import type { Roles } from "../common/enums";

/**
 * Componente RolesDropdown
 *
 * Responsabilidad única: Renderizar un dropdown para cambiar de rol
 *
 * Soporta dos estructuras de roles:
 * - Roles[] directo: ["ADMIN", "SUPER_ADMIN"]
 * - UserRole[]: [{ role: "ADMIN" }, { role: "SUPER_ADMIN" }]
 *
 * Lógica separada en:
 * - useNormalizeRoles: Normaliza estructuras de roles
 * - useDropdownMenu: Gestiona abrir/cerrar y clicks fuera
 * - useInitializeActiveRole: Inicializa el rol si es necesario
 * - useActiveRole: Obtiene/actualiza el rol activo
 * - useValidateRolesConsistency: Valida que los roles sean válidos
 */
export const RolesDropdown = () => {
  const { user, refreshAssignments } = useAuthManager();
  const { activeRole, setActiveRole } = useActiveRole();
  const { assignmentId, setAssignmentId } = useAssignmentPersistence();
  const { isOpen, toggleOpen, closeMenu, dropdownRef } = useDropdownMenu();

  // Normalizar roles independientemente de la estructura
  const rolesArray: Roles[] = useNormalizeRoles(user?.roles);
  const assignments = Array.from(
    new Set(
      (user?.assignments ?? [])
        .map((item) => item.assignmentId)
        .filter((value): value is string =>
          Boolean(value && value.trim().length > 0),
        ),
    ),
  );

  // Validar consistencia de roles
  useValidateRolesConsistency(rolesArray);

  // Inicializar rol si es necesario
  useInitializeActiveRole(rolesArray);

  const showRolesSection = rolesArray.length > 1;
  const showAssignmentsSection =
    activeRole === "ADMIN" && assignments.length > 1;

  if (!showRolesSection && !showAssignmentsSection) {
    return null;
  }

  const handleRoleSelect = async (role: Roles) => {
    setActiveRole(role);

    const refreshedAssignments = await refreshAssignments();
    const nextAssignmentId = refreshedAssignments[0]?.assignmentId ?? "";

    if (nextAssignmentId) {
      setAssignmentId(nextAssignmentId);
    }

    closeMenu();
  };

  const handleAssignmentSelect = (value: string) => {
    setAssignmentId(value);
    closeMenu();
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        type="button"
        className="btn btn-default btn-sm"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={
          showRolesSection
            ? `Rol actual: ${getRoleLabel(activeRole)}`
            : "Asignación actual"
        }
        aria-label="Abrir selector de roles y asignaciones"
      >
        <i className="fa fa-exchange" />
      </button>

      {isOpen && (
        <ul
          className="dropdown-menu dropdown-user"
          style={{
            display: "block",
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: "5px",
            minWidth: "180px",
            zIndex: 1000,
          }}
        >
          {showRolesSection && (
            <>
              <li
                className="dropdown-header"
                style={{
                  padding: "8px 12px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  color: "#777",
                }}
              >
                Roles
              </li>
              {rolesArray.map((role) => (
                <li key={role}>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleRoleSelect(role)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      padding: "8px 12px",
                      cursor: "pointer",
                      backgroundColor:
                        activeRole === role ? "#f3f3f3" : "transparent",
                      fontWeight: activeRole === role ? "bold" : "normal",
                    }}
                  >
                    <i
                      className={`fa ${
                        activeRole === role ? "fa-check-circle" : "fa-circle-o"
                      }`}
                      style={{ marginRight: "8px" }}
                    />
                    {getRoleLabel(role)}
                  </button>
                </li>
              ))}
            </>
          )}

          {showAssignmentsSection && (
            <>
              {showRolesSection && <li className="dropdown-divider" />}
              <li
                className="dropdown-header"
                style={{
                  padding: "8px 12px",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  color: "#777",
                }}
              >
                Asignaciones
              </li>
              {assignments.map((value, index) => (
                <li key={value}>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleAssignmentSelect(value)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      padding: "8px 12px",
                      cursor: "pointer",
                      backgroundColor:
                        assignmentId === value ? "#f3f3f3" : "transparent",
                      fontWeight: assignmentId === value ? "bold" : "normal",
                    }}
                  >
                    <i
                      className={`fa ${assignmentId === value ? "fa-check-circle" : "fa-circle-o"}`}
                      style={{ marginRight: "8px" }}
                    />
                    {`Asignación ${index + 1}`}
                  </button>
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
};
