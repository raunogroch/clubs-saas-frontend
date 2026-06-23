import { getGenderLabel, getStatusLabel } from "../../common";
import {
  Breadcumbs,
  IBox,
  PaginationOptions,
  PaginationTable,
  RolesHighlight,
} from "../../components";
import {
  useModalManagement,
  useModalSaveHandler,
  usePaginationState,
  useSearchSetup,
} from "../../core/hooks";
import type { User, UserPageProps } from "../../core/interfaces";
import { useUsers } from "../../features/users";
import { UserModal } from "../../modals";

export const UserAdminPage = (props: UserPageProps) => {
  const {
    isOpen: isModalOpen,
    selectedItem: selectedUser,
    isCreating,
    handleCreate,
    handleEdit,
    handleClose: handleCloseModal,
  } = useModalManagement<User>();

  const {
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    calculateTotalPages,
  } = usePaginationState();

  const { searchValue } = useSearchSetup();

  const { users, meta, isLoading, error, refetch } = useUsers({
    role:
      props.roleList && props.roleList !== "*" && Array.isArray(props.roleList)
        ? props.roleList[0]
        : undefined,
    search: searchValue,
    page,
    limit: pageSize,
  });

  const totalPages = calculateTotalPages(meta?.total, {
    totalPages: meta?.totalPages,
    lastPage: meta?.lastPage,
    limit: meta?.limit,
  });

  const handleSaved = useModalSaveHandler({
    isCreating,
    selectedItem: selectedUser,
    refetch,
    onModalClose: handleCloseModal,
  });

  return (
    <>
      <Breadcumbs
        title="Usuarios"
        items={[
          { label: "Inicio", route: "/dashboard" },
          { label: "Usuarios" },
        ]}
      >
        <button
          className="btn btn-rounded btn-primary"
          onClick={handleCreate}
          aria-label="Crear"
        >
          <i className="fa fa-plus" />
          &nbsp;Crear
        </button>
      </Breadcumbs>

      <UserModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedUser}
        onSaved={handleSaved}
        roleList={props.roleList}
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
                          <RolesHighlight
                            roles={user.memberships?.map((m) => m.role) || []}
                          />
                        </td>

                        <td className="align-middle">
                          {getStatusLabel(user.status)}
                        </td>

                        <td className="align-middle">
                          <button
                            className="btn btn-sm btn-rounded btn-primary"
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
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            </>
          )}
        </IBox>
      </div>
    </>
  );
};
