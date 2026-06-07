import { useState } from "react";
import { Breadcrumbs, IBox, PaginationOptions } from "../components";
import { UserModal } from "../modals/UserModal";
import { useUsers } from "../features/users/userHooks";
import { PaginationTable } from "../components/PaginationTable";
import { useSearchSetup } from "../core/hooks/useSearchSetup";
import type { User } from "../features/users/userApi";
import {
  getGenderLabel,
  getRoleLabel,
  getStatusLabel,
} from "../common/translations";
import { LabelHighlight } from "../components/LabelHighlight";

export const UserPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { searchValue } = useSearchSetup();

  const {
    users,
    meta,
    isLoading,
    error: isError,
    refetch,
  } = useUsers({
    role: "ADMIN",
    search: searchValue,
    page,
    limit: pageSize,
  });

  const totalPages =
    meta?.totalPages ??
    meta?.lastPage ??
    (meta?.limit ? Math.ceil((meta?.total || 0) / meta.limit) : 1);

  return (
    <>
      <Breadcrumbs title="Usuarios">
        <button
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#userModal"
          onClick={() => setSelectedUser(undefined)}
        >
          Crear usuario
        </button>
        <UserModal
          identifier="userModal"
          data={selectedUser}
          onSaved={() => {
            setSelectedUser(undefined);
            refetch();
          }}
        />
      </Breadcrumbs>
      <div className="wrapper wrapper-content animated fadeInRight">
        <IBox title="Usuarios">
          {isLoading && <p>Cargando usuarios...</p>}
          {isError && (
            <p className="text-danger">Error al cargar los usuarios.</p>
          )}
          {!isLoading && !isError && users.length === 0 && (
            <p>No hay usuarios registrados.</p>
          )}
          {!isLoading && !isError && users.length > 0 && (
            <>
              <div className="table-responsive">
                <div className="d-flex justify-content-end mb-2">
                  <PaginationOptions
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    setPage={setPage}
                  />
                </div>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>Nombre</th>
                      <th>Usuario</th>
                      <th>DNI</th>
                      <th>Género</th>
                      <th>Fecha Nacimiento</th>
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
                        <td>{(page - 1) * pageSize + index + 1}</td>
                        <td>{`${user.name} ${user.lastname}`}</td>
                        <td>{user.username}</td>
                        <td>{user.dni || "N/A"}</td>
                        <td>{getGenderLabel(user.gender)}</td>
                        <td>
                          {user.birthDate
                            ? new Date(user.birthDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td>{user.phone || "N/A"}</td>
                        <td>{user.address || "N/A"}</td>
                        <td>
                          {user.roles?.map((role: any) => (
                            <div key={role.id}>
                              <LabelHighlight
                                text={getRoleLabel(role.role)}
                                type="info"
                                location="center"
                              />
                            </div>
                          ))}
                        </td>
                        <td>{getStatusLabel(user.status)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            data-toggle="modal"
                            data-target="#userModal"
                            onClick={() => setSelectedUser(user)}
                          >
                            Editar
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
                total={meta?.total}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </>
          )}
        </IBox>
      </div>
    </>
  );
};
