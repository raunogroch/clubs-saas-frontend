import { useAuthManager } from "../features/auth/authHooks";
import { getRoleLabel } from "../common/translations";
import { useActiveRole } from "../core/context/ActiveRoleContext";
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
  const { user } = useAuthManager();
  const { activeRole, setActiveRole } = useActiveRole();
  const { isOpen, toggleOpen, closeMenu, dropdownRef } = useDropdownMenu();

  // Normalizar roles independientemente de la estructura
  const rolesArray: Roles[] = useNormalizeRoles(user?.roles);

  // Validar consistencia de roles
  useValidateRolesConsistency(rolesArray);

  // Inicializar rol si es necesario
  useInitializeActiveRole(rolesArray);

  if (rolesArray.length < 2) {
    return null;
  }

  const handleRoleSelect = (role: Roles) => {
    setActiveRole(role);
    closeMenu();
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        type="button"
        className="btn btn-white"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Rol actual: ${getRoleLabel(activeRole)}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <i className="fa fa-exchange" />

        <span className="label label-primary">{getRoleLabel(activeRole)}</span>
      </button>

      {isOpen && (
        <ul
          className="dropdown-menu dropdown-user"
          style={{
            display: "block",
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "5px",
            minWidth: "180px",
            zIndex: 1000,
          }}
        >
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
                  style={{
                    marginRight: "8px",
                  }}
                />

                {getRoleLabel(role)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
