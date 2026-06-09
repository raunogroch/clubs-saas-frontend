import { useCallback } from "react";
import { useState } from "react";

import { Breadcrumbs, IBox, PaginationOptions } from "../components";
import { PaginationTable } from "../components/PaginationTable";
import { UserModal } from "../modals/UserModal";
import { useUsers } from "../features/users/userHooks";
import { useSearchSetup } from "../core/hooks/useSearchSetup";

import type { User } from "../features/users/userApi";

import { getGenderLabel, getStatusLabel } from "../common/translations";
import { RolesHighlight } from "../components/RolesHighlight";

export const UserPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { searchValue } = useSearchSetup();

  const { users, meta, isLoading, error, refetch } = useUsers({
    role: "ADMIN",
    search: searchValue,
    page,
    limit: pageSize,
  });

  const totalPages =
    meta?.totalPages ??
    meta?.lastPage ??
    (meta?.limit ? Math.ceil((meta.total ?? 0) / meta.limit) : 1);

  /**
   * Abrir modal para crear nuevo usuario
   * Memoizado para evitar recreación en cada render
   */
  const handleCreate = useCallback(() => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  }, []);

  /**
   * Abrir modal para editar usuario
   * Memoizado para evitar recreación en cada render
   */
  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  /**
   * Cerrar modal y limpiar estado
   */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  }, []);

  /**
   * Callback cuando se guarda un usuario
   * Refetch y cierre automático
   */
  const handleSaved = useCallback(async () => {
    await refetch();
    handleCloseModal();
  }, [refetch, handleCloseModal]);

  return (
    <>
      <Breadcrumbs title="Usuarios">
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          aria-label="Crear nuevo usuario"
        >
          <i className="fa fa-plus me-2" />
          &nbsp; Crear usuario
        </button>
      </Breadcrumbs>

      {/* Modal de crear/editar usuario */}
      <UserModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedUser}
        onSaved={handleSaved}
      />

      <div className="wrapper wrapper-content animated fadeInRight">
        <IBox title="Usuarios">
          {isLoading && <p className="text-info">Cargando usuarios...</p>}

          {error && (
            <div className="alert alert-danger" role="alert">
              Error al cargar usuarios
            </div>
          )}

          {!isLoading && !error && users.length === 0 && (
            <p className="text-muted">No existen usuarios registrados.</p>
          )}

          {!isLoading && !error && users.length > 0 && (
            <>
              <div className="table-responsive">
                <div className="d-flex justify-content-end mb-3">
                  <PaginationOptions
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    setPage={setPage}
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
                        <td>{(page - 1) * pageSize + index + 1}</td>

                        <td>
                          <strong>
                            {user.name} {user.lastname}
                          </strong>
                        </td>

                        <td>{user.username}</td>

                        <td>{user.dni ?? "-"}</td>

                        <td>{getGenderLabel(user.gender)}</td>

                        <td>
                          {user.birthDate
                            ? new Date(user.birthDate).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>{user.phone ?? "-"}</td>

                        <td>{user.address ?? "-"}</td>

                        <td>
                          <RolesHighlight roles={user.roles} />
                        </td>

                        <td>{getStatusLabel(user.status)}</td>

                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(user)}
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
