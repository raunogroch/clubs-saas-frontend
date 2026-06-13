import { Breadcrumbs, IBox, PaginationOptions } from "../components";
import { PaginationTable } from "../components/PaginationTable";
import { ClubModal } from "../modals/ClubModal";
import { useClubs } from "../features/clubs/clubHooks";
import {
  useModalManagement,
  useModalSaveHandler,
  usePaginationState,
} from "../core/hooks";
import { useAssignmentPersistence } from "../core/hooks";
import { useActiveRole } from "../core/context/useActiveRole";
import { useAuthManager } from "../features/auth/useAuthManager";
import type { Club } from "../core/interfaces/Clubs";
import { Roles } from "../common/enums";
//import { useNotification } from "../core/hooks/useNotification";
import { getClubStatusLabel, getSportLabel } from "../common/translations";

export const ClubPage = () => {
  const { user } = useAuthManager();
  const { activeRole } = useActiveRole();
  const { assignmentId: persistedAssignmentId } = useAssignmentPersistence();
  const {
    isOpen: isModalOpen,
    selectedItem: selectedClub,
    isCreating,
    handleCreate,
    handleEdit,
    handleClose: handleCloseModal,
  } = useModalManagement<Club>();

  const {
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    calculateTotalPages,
  } = usePaginationState();

  const assignmentFilter =
    activeRole === Roles.ADMIN
      ? persistedAssignmentId || user?.assignments?.[0]?.assignmentId || ""
      : undefined;

  const { clubs, meta, isLoading, error, refetch } = useClubs({
    page,
    limit: pageSize,
    assignmentId: assignmentFilter,
  });

  //const { deleteClub } = useDeleteClub();
  //const { success, error: notifyError } = useNotification();

  const totalPages = calculateTotalPages(meta?.total, {
    totalPages: meta?.totalPages,
    lastPage: meta?.lastPage,
    limit: meta?.limit,
  });

  const handleSaved = useModalSaveHandler({
    isCreating,
    selectedItem: selectedClub,
    refetch,
    onModalClose: handleCloseModal,
  });

  //   const handleDelete = async (club: Club) => {
  //     if (!window.confirm(`¿Deseas eliminar el club ${club.name}?`)) return;

  //     try {
  //       await deleteClub(club.id);
  //       await refetch();
  //       success(`Club ${club.name} eliminado correctamente`);
  //     } catch (err) {
  //       console.error(err);
  //       notifyError("No se pudo eliminar el club");
  //     }
  //   };

  return (
    <>
      <Breadcrumbs title="Clubes">
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          aria-label="Crear nuevo club"
        >
          <i className="fa fa-plus me-2" />
          &nbsp; Crear club
        </button>
      </Breadcrumbs>

      <ClubModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedClub}
        onSaved={handleSaved}
      />

      <div className="wrapper wrapper-content animated fadeInRight">
        <IBox title="Clubes">
          {isLoading && <p className="text-info">Cargando clubes...</p>}

          {error && (
            <div className="alert alert-danger" role="alert">
              Error al cargar clubes
            </div>
          )}

          {!isLoading && !error && clubs.length === 0 && (
            <p className="text-muted">No existen clubes registrados.</p>
          )}

          {!isLoading && !error && clubs.length > 0 && (
            <>
              <div className="d-flex justify-content-end mb-3">
                <PaginationOptions
                  pageSize={pageSize}
                  setPageSize={onPageSizeChange}
                  setPage={onPageChange}
                />
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Deporte</th>
                      <th>Telefono</th>
                      <th>Ciudad</th>
                      <th>País</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clubs.map((club) => (
                      <tr key={club.id}>
                        <td className="align-middle">{club.name}</td>
                        <td className="align-middle">
                          {getSportLabel(club.sport) ?? club.sport}
                        </td>
                        <td className="align-middle">{club.phone}</td>
                        <td className="align-middle">{club.city}</td>
                        <td className="align-middle">{club.country}</td>
                        <td className="align-middle">
                          {getClubStatusLabel(club.status) ?? club.status}
                        </td>
                        <td className="align-middle">
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleEdit(club)}
                            aria-label={`Editar club ${club.name}`}
                          >
                            <i className="fa fa-edit me-1" />
                            &nbsp;Editar
                          </button>
                          {/* <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(club)}
                            aria-label={`Eliminar club ${club.name}`}
                          >
                            <i className="fa fa-trash me-1" />
                            Eliminar
                          </button> */}
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
