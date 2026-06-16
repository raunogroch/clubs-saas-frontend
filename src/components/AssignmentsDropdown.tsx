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
    <div ref={dropdownRef} className="assignments-dropdown-container">
      <button
        type="button"
        className="btn btn-rounded btn-sm btn-white assignments-dropdown-button"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Assignment activo: ${selectedAssignmentLabel}`}
      >
        <i className="fa fa-briefcase" />
        <span className="label label-primary">{selectedAssignmentLabel}</span>
      </button>

      {isOpen && (
        <ul className="dropdown-menu dropdown-user dropdown-assignments">
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
        </ul>
      )}
    </div>
  );
};
