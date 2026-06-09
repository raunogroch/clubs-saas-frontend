import { useEffect, useRef, useState } from "react";

import { useAuthManager } from "../features/auth/authHooks";
import { getRoleLabel } from "../common/translations";
import type { Roles } from "../common";

export const RolesDropdown = () => {
  const { user } = useAuthManager();

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const rolesArray: any[] = user?.roles ?? [];

  const [selectedRole, setSelectedRole] = useState<Roles | undefined>();

  useEffect(() => {
    if (
      rolesArray.length > 0 &&
      (!selectedRole || !rolesArray.includes(selectedRole))
    ) {
      setSelectedRole(rolesArray[0]);
    }
  }, [rolesArray, selectedRole]);

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
    setSelectedRole(role);
    setIsOpen(false);

    // TODO:
    // dispatch(setActiveRole(role));
  };

  if (import.meta.env.DEV) {
    console.log("Usuario:", user);
    console.log("Roles:", rolesArray);
    console.log("Rol seleccionado:", selectedRole);
  }

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        type="button"
        className="btn btn-xs btn-white"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Rol actual: ${getRoleLabel(selectedRole)}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <i className="fa fa-exchange" />

        <span
          className="label label-primary"
          style={{
            fontSize: "11px",
          }}
        >
          {getRoleLabel(selectedRole)}
        </span>
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
                    selectedRole === role ? "#f3f3f3" : "transparent",
                  fontWeight: selectedRole === role ? "bold" : "normal",
                }}
              >
                <i
                  className={`fa ${
                    selectedRole === role ? "fa-check-circle" : "fa-circle-o"
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
