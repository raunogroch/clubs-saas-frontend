import type { AssignmentTableProps } from "../core/interfaces";

export const AssignmentTable = (props: AssignmentTableProps) => {
  const { assignments, page, pageSize, getOwnerNames, onEdit } = props;
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>N°</th>
            <th>Nombre</th>
            <th>Propietarios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => {
            const ownersList = getOwnerNames(assignment.owners);

            return (
              <tr key={assignment.id}>
                <td className="align-middle">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="align-middle">{assignment.name}</td>
                <td className="align-middle">
                  {ownersList.length === 0 ? (
                    <span className="text-muted">N/A</span>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {ownersList.map((name, i) => (
                        <li key={i}>- {name}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="align-middle">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onEdit(assignment)}
                    aria-label={`Editar asignación ${assignment.name}`}
                  >
                    <i className="fa fa-edit me-1" />
                    &nbsp;Editar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
