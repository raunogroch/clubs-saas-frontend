import { useEffect, useRef, useState } from "react";

import { useAuthManager } from "../features/auth/authHooks";
import { getRoleLabel } from "../common/translations";
import { useActiveRole } from "../core/context/ActiveRoleContext";
import type { Roles } from "../common";

export const RolesDropdown = () => {
  const { user } = useAuthManager();
  const { activeRole, setActiveRole } = useActiveRole();

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const rolesArray: any[] = user?.roles ?? [];

  useEffect(() => {
    if (
      rolesArray.length > 0 &&
      (!activeRole || !rolesArray.includes(activeRole))
    ) {
      setActiveRole(rolesArray[0]);
    }
  }, [rolesArray, activeRole, setActiveRole]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (rolesArray.length < 2) {
    return null;
  }

  const handleRoleSelect = (role: Roles) => {
    setActiveRole(role);
    setIsOpen(false);
  };

  if (import.meta.env.DEV) {
    console.log("Usuario:", user);
    console.log("Roles:", rolesArray);
    console.log("Rol activo:", activeRole);
  }

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        type="button"
        className="btn btn-white"
        onClick={() => setIsOpen((prev) => !prev)}
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

        <span className="label label-danger">{getRoleLabel(activeRole)}</span>
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
