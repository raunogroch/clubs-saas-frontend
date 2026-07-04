import { Breadcumbs, IBox, PaginationOptions } from "../components";
import { PaginationTable } from "../components/PaginationTable";
import { ClubModal } from "../modals/ClubModal";
import { useNavigate } from "react-router-dom";
import { useClubs } from "../features/clubs";
import {
  useModalManagement,
  useModalSaveHandler,
  usePaginationState,
} from "../core/hooks";
import { useAssignmentPersistence } from "../core/hooks";
import { useActiveRole } from "../core/context/useActiveRole";
import { useAuthManager } from "../features/auth";
import type { Club } from "../core/interfaces/Clubs";
import { Roles } from "../common/enums";
//import { useNotification } from "../core/hooks/useNotification";
import { getClubStatusLabel, getSportLabel } from "../common/translations";

export const ClubPage = () => {
  const navigate = useNavigate();
  const { activeAssignmentId } = useAuthManager();
  const { activeRole } = useActiveRole();
  const {
    assignmentId: persistedAssignmentId,
    setAssignmentId,
    setClubId,
  } = useAssignmentPersistence();
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
      ? persistedAssignmentId || activeAssignmentId || ""
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

  return (
    <>
      <Breadcumbs
        title="Clubes"
        items={[{ label: "Inicio", route: "/dashboard" }, { label: "Clubs" }]}
      >
        <button
          className="btn btn-rounded btn-primary"
          onClick={handleCreate}
          aria-label="Crear nuevo club"
        >
          <i className="fa fa-plus" />
          &nbsp;Crear
        </button>
      </Breadcumbs>

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
                      <th>Disciplina</th>
                      <th>Grupos</th>
                      <th>Telefono</th>
                      <th>Estado</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clubs.map((club) => (
                      <tr key={club.id}>
                        <td className="align-middle">{club.name}</td>
                        <td className="align-middle">
                          {getSportLabel(club.sport) ?? club.sport}
                        </td>

                        <td className="align-middle">
                          <button
                            className="btn btn-sm btn-rounded btn-info"
                            onClick={() => {
                              setAssignmentId(
                                club.assignmentId || persistedAssignmentId,
                              );
                              setClubId(club.id);
                              navigate(`/clubs/${club.id}/groups`);
                            }}
                            aria-label={`Ver grupos de ${club.name}`}
                          >
                            <i className="fa fa-list" />
                            &nbsp;Ingresar
                          </button>
                        </td>
                        <td className="align-middle">{club.phone}</td>
                        <td className="align-middle">
                          {getClubStatusLabel(club.status) ?? club.status}
                        </td>
                        <td className="align-middle text-center">
                          <button
                            className="btn btn-sm btn-rounded btn-primary mx-2"
                            onClick={() => handleEdit(club)}
                            aria-label={`Editar club ${club.name}`}
                          >
                            <i className="fa fa-edit" />
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
