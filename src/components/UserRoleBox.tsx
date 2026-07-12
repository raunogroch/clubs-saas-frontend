import React from "react";
import { getGenderLabel, getStatusLabel, Roles, getRoleLabel } from "../common";
import { IBox, PaginationOptions, PaginationTable } from "./index";
import { UserAvatar } from "./UserAvatar";
import type { User } from "../core/interfaces";

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
  searchValue: string;
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
  searchValue,
  onPageChange,
  onPageSizeChange,
  onEdit,
}: UserRoleBoxProps) => {
  const roleLabel = getRoleLabel(role) || role;

  const isMultipleRoles = rolesCount > 1;
  const hasSearch = searchValue.trim().length > 0;
  const hasResults = users.length > 0;

  const boxTitle: React.ReactNode =
    hasSearch && hasResults ? (
      <div className="d-flex align-items-center gap-2">
        {roleLabel} &nbsp;
        <span className="badge bg-danger">{users.length}</span>
      </div>
    ) : (
      roleLabel
    );

  return (
    <IBox title={boxTitle} initialCollapsed={isMultipleRoles}>
      {isLoading && <p className="text-info mb-0">Cargando usuarios...</p>}

      {!isLoading && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
        <p className="text-muted mb-0">
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

            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Foto</th>
                  <th>N°</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>DNI</th>
                  <th>Género</th>
                  <th>Nacimiento</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td className="align-middle">
                      {(() => {
                        const profileFile = user.files?.find(
                          (file) => file.type === "PROFILE_IMAGE",
                        );

                        return (
                          <UserAvatar
                            imageUrl={profileFile?.url}
                            name={`${user.name} ${user.lastname} ${profileFile?.url}`.trim()}
                            size={36}
                          />
                        );
                      })()}
                    </td>

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
                      {getStatusLabel(user.status)}
                    </td>

                    <td className="align-middle">
                      <button
                        type="button"
                        className="btn btn-sm btn-rounded btn-primary"
                        onClick={() => onEdit(user)}
                        aria-label={`Editar usuario ${user.name} ${user.lastname}`}
                      >
                        <i className="fa fa-edit" /> Editar
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
