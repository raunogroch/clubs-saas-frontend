import { useEffect } from "react";
import { useAssignmentPersistence } from "../core/hooks";
import { useDropdownMenu } from "../core/hooks/useDropdownMenu";
import { useAuthManager } from "../features/auth/useAuthManager";

export const AssignmentsDropdown = () => {
  const { user } = useAuthManager();
  const { assignmentId, setAssignmentId } = useAssignmentPersistence();
  const { isOpen, toggleOpen, closeMenu, dropdownRef } = useDropdownMenu();

  const assignments = Array.from(
    new Set(
      (user?.assignments ?? [])
        .map((item) => item.assignmentId)
        .filter((value): value is string =>
          Boolean(value && value.trim().length > 0),
        ),
    ),
  );

  useEffect(() => {
    if (!assignmentId && assignments.length > 0) {
      setAssignmentId(assignments[0]);
    }
  }, [assignmentId, assignments, setAssignmentId]);

  if (assignments.length < 2) {
    return null;
  }

  const selectedAssignmentIndex = assignments.findIndex(
    (value) => value === assignmentId,
  );
  const selectedAssignmentLabel =
    selectedAssignmentIndex >= 0
      ? `Asignación ${selectedAssignmentIndex + 1}`
      : "Asignación 1";

  const handleAssignmentSelect = (value: string) => {
    setAssignmentId(value);
    closeMenu();
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative", marginRight: "8px" }}>
      <button
        type="button"
        className="btn btn-white"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Assignment activo: ${selectedAssignmentLabel}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <i className="fa fa-briefcase" />
        <span className="label label-primary">{selectedAssignmentLabel}</span>
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
            minWidth: "220px",
            zIndex: 1000,
          }}
        >
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
        </ul>
      )}
    </div>
  );
};
