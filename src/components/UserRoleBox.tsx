import { getGenderLabel, getStatusLabel } from "../common";
import {
  IBox,
  PaginationOptions,
  PaginationTable,
  RolesHighlight,
} from "./index";
import type { User } from "../core/interfaces";
import { Roles, getRoleLabel } from "../common";

interface UserRoleBoxProps {
  role: Roles;
  users: User[];
  isLoading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  totalPages: number;
  total?: number;
  rolesCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (user: User) => void;
}

export const UserRoleBox = ({
  role,
  users,
  isLoading,
  error,
  page,
  pageSize,
  totalPages,
  total,
  rolesCount,
  onPageChange,
  onPageSizeChange,
  onEdit,
}: UserRoleBoxProps) => {
  const roleLabel = getRoleLabel(role) || role;
  const boxTitle = `${roleLabel}`;
  const isMultipleRoles = rolesCount > 1;

  return (
    <IBox title={boxTitle} initialCollapsed={isMultipleRoles}>
      {isLoading && <p className="text-info">Cargando usuarios...</p>}

      {error && (
        <div className="alert alert-danger" role="alert">
          Error al cargar usuarios
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
        <p className="text-muted">
          No existen usuarios registrados para este rol.
        </p>
      )}

      {!isLoading && !error && users.length > 0 && (
        <>
          <div className="table-responsive">
            <div className="d-flex justify-content-end mb-3">
              <PaginationOptions
                pageSize={pageSize}
                setPageSize={onPageSizeChange}
                setPage={onPageChange}
              />
            </div>

            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>N°</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>DNI</th>
                  <th>Género</th>
                  <th>Nacimiento</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Roles</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td className="align-middle">
                      {(page - 1) * pageSize + index + 1}
                    </td>

                    <td className="align-middle">
                      <strong>
                        {user.name} {user.lastname}
                      </strong>
                    </td>

                    <td className="align-middle">{user.username}</td>

                    <td className="align-middle">{user.dni ?? "-"}</td>

                    <td className="align-middle">
                      {getGenderLabel(user.gender)}
                    </td>

                    <td className="align-middle">
                      {user.birthDate
                        ? new Date(user.birthDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="align-middle">{user.phone ?? "-"}</td>

                    <td className="align-middle">{user.address ?? "-"}</td>

                    <td className="align-middle">
                      <RolesHighlight roles={user.roles} />
                    </td>

                    <td className="align-middle">
                      {getStatusLabel(user.status)}
                    </td>

                    <td className="align-middle">
                      <button
                        className="btn btn-sm btn-rounded btn-primary"
                        onClick={() => onEdit(user)}
                        aria-label={`Editar usuario ${user.name} ${user.lastname}`}
                      >
                        <i className="fa fa-edit me-1" />
                        &nbsp;Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationTable
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </>
      )}
    </IBox>
  );
};
