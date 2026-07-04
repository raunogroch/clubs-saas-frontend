import { useAuthManager, useAssignmentSelection } from "../features/auth";
import { getRoleLabel } from "../common/translations";
import { useActiveRole } from "../core/context/useActiveRole";
import { useAssignmentPersistence } from "../core/hooks";
import { useDropdownMenu } from "../core/hooks/useDropdownMenu";
import { useInitializeActiveRole } from "../core/hooks/useInitializeActiveRole";
import { useValidateRolesConsistency } from "../core/hooks/useValidateRolesConsistency";
import { useGetRolesFromMemberships } from "../core/hooks/useGetRolesFromMemberships";
import { Roles as RolesEnum } from "../common/enums";
import type { Roles } from "../common/enums";
import { useCallback, useMemo } from "react";
import type { Membership } from "../core/interfaces/User";

/**
 * Componente RolesDropdown
 *
 * Responsabilidad única: Renderizar un dropdown para cambiar de rol
 *
 * Soporta múltiples estructuras de roles:
 * - Nueva: user.memberships[] (roles con estado)
 * - Antigua: user.roles[] (UserRole[] o Roles[])
 * - Legacy: user.assignments[] (para retrocompatibilidad)
 *
 * Lógica separada en:
 * - useGetRolesFromMemberships: Extrae roles desde memberships
 * - useNormalizeRoles: Normaliza estructuras de roles antiguas
 * - useDropdownMenu: Gestiona abrir/cerrar y clicks fuera
 * - useInitializeActiveRole: Inicializa el rol si es necesario
 * - useActiveRole: Obtiene/actualiza el rol activo
 * - useValidateRolesConsistency: Valida que los roles sean válidos
 * - useAssignmentSelection: Actualiza assignment en localStorage y Redux
 */
export const RolesDropdown = () => {
  const { user, refreshAssignments } = useAuthManager();
  const { selectAssignment } = useAssignmentSelection();
  const { activeRole, setActiveRole } = useActiveRole();
  const { assignmentId } = useAssignmentPersistence();
  const { isOpen, toggleOpen, closeMenu, dropdownRef } = useDropdownMenu();

  // Obtener roles desde memberships
  const rolesArray: Roles[] = useGetRolesFromMemberships(user?.memberships);

  // Extraer assignmentIds desde memberships
  const assignments = useMemo(() => {
    const rawIds = (user?.memberships ?? [])
      .map((item: Membership | undefined) => item?.assignmentId)
      .filter((value): value is string => typeof value === "string");

    return Array.from(new Set(rawIds)).filter(
      (value) => value.trim().length > 0,
    );
  }, [user?.memberships]);

  // Validar consistencia de roles
  useValidateRolesConsistency(rolesArray);

  // Inicializar rol si es necesario
  useInitializeActiveRole(rolesArray);
  const handleRoleSelect = useCallback(
    async (role: Roles) => {
      // Si es ADMIN o SUPER_ADMIN, cargar los assignments del usuario
      if (role === RolesEnum.ADMIN || role === RolesEnum.SUPER_ADMIN) {
        const refreshedAssignments = await refreshAssignments();

        // Buscar el PRIMER assignment válido con assignmentId
        let nextAssignmentId = refreshedAssignments?.find(
          (a) => a.assignmentId && a.assignmentId.trim().length > 0,
        )?.assignmentId;

        // Si no hay en refreshedAssignments, buscar en memberships del usuario
        if (!nextAssignmentId) {
          nextAssignmentId = user?.memberships
            ?.filter((m) => m.role === role && m.assignmentId)
            .find(
              (m) => m.assignmentId && m.assignmentId.trim().length > 0,
            )?.assignmentId;
        }

        if (nextAssignmentId) {
          // Establecer activeAssignmentId PRIMERO (antes de cambiar el rol)
          selectAssignment(nextAssignmentId);
        } else {
          selectAssignment("");
        }
      } else {
        // Para otros roles, obtener el primer assignmentId del rol actual
        const currentMembership = user?.memberships?.find(
          (m: Membership) => m.role === role,
        );
        if (currentMembership?.assignmentId) {
          // Establecer activeAssignmentId PRIMERO
          selectAssignment(currentMembership.assignmentId);
        } else {
          selectAssignment("");
        }
      }

      // Cambiar el rol DESPUÉS de establecer activeAssignmentId
      // Así cuando DashboardPage se re-renderice, activeAssignmentId ya estará correcto
      setActiveRole(role);
      closeMenu();
    },
    [
      refreshAssignments,
      user?.memberships,
      selectAssignment,
      setActiveRole,
      closeMenu,
    ],
  );

  const handleAssignmentSelect = useCallback(
    (value: string) => {
      selectAssignment(value);
      closeMenu();
    },
    [selectAssignment, closeMenu],
  );

  const showRolesSection = rolesArray.length > 1;
  const showAssignmentsSection =
    activeRole === RolesEnum.ADMIN && assignments.length > 1;

  if (!showRolesSection && !showAssignmentsSection) {
    return null;
  }

  return (
    <div ref={dropdownRef} className="roles-dropdown-container">
      <button
        type="button"
        className="btn btn-rounded btn-default btn-sm"
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
        <ul className="dropdown-menu dropdown-user dropdown-centered">
          {showRolesSection && (
            <>
              <li className="dropdown-header-styled">Roles</li>
              {rolesArray.map((role) => (
                <li key={role}>
                  <button
                    type="button"
                    className={`dropdown-item-custom ${activeRole === role ? "active" : ""}`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <i
                      className={`fa dropdown-item-icon ${
                        activeRole === role ? "fa-check-circle" : "fa-circle-o"
                      }`}
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
              <li className="dropdown-header-styled">Asignaciones</li>
              {assignments.map((value, index) => (
                <li key={value}>
                  <button
                    type="button"
                    className={`dropdown-item-custom ${assignmentId === value ? "active" : ""}`}
                    onClick={() => handleAssignmentSelect(value)}
                  >
                    <i
                      className={`fa dropdown-item-icon ${assignmentId === value ? "fa-check-circle" : "fa-circle-o"}`}
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
