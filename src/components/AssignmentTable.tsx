import type { AssignmentTableProps } from "../core/interfaces";

export const AssignmentTable = (props: AssignmentTableProps) => {
  const { assignments, page, pageSize, onEdit, onManageAdministrators } = props;

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>N°</th>
            <th>Nombre</th>
            <th>Administradores</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => {
            const administratorCount = assignment.administrators?.length ?? 0;
            const administratorLabel =
              administratorCount === 0
                ? "0 asignados"
                : `${administratorCount} ${administratorCount === 1 ? "administrador" : "administradores"}`;

            return (
              <tr key={assignment.id}>
                <td className="align-middle">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="align-middle">{assignment.name}</td>
                <td className="align-middle">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <button
                      className="btn btn-rounded btn-sm btn-outline-primary"
                      onClick={() => onManageAdministrators(assignment)}
                      aria-label={`Gestionar administradores de ${assignment.name}`}
                    >
                      <i className="fa fa-user-plus me-1" />
                    </button>
                    <span>{administratorLabel}</span>
                  </div>
                </td>
                <td className="align-middle">
                  <button
                    className="btn btn-rounded btn-sm btn-primary"
                    onClick={() => onEdit(assignment)}
                    aria-label={`Editar nombre de ${assignment.name}`}
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
