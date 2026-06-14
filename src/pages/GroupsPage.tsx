import { Breadcrumbs, IBox, PaginationOptions } from "../components";
import { GroupsModal } from "../modals/GroupsModal";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useGroups } from "../features/groups/groupHooks";
import {
  useModalManagement,
  useModalSaveHandler,
  usePaginationState,
} from "../core/hooks";
import { useAssignmentPersistence } from "../core/hooks";
import { useActiveRole } from "../core/context/useActiveRole";
import { useAuthManager } from "../features/auth/useAuthManager";
import { useClubs } from "../features/clubs/clubHooks";
import type { Group } from "../core/interfaces/Groups";
import { Roles } from "../common/enums";
import { statusLabels } from "../common/translations";

export const GroupsPage = () => {
  // ==================== HOOKS & ESTADO ====================
  const { clubId: routeClubId } = useParams<{ clubId?: string }>();
  const navigate = useNavigate();
  const previousAssignmentId = useRef<string | undefined>(undefined);
  const { user } = useAuthManager();
  const { activeRole } = useActiveRole();
  const { assignmentId: persistedAssignmentId, clubId: persistedClubId } =
    useAssignmentPersistence();

  const {
    isOpen: isModalOpen,
    selectedItem: selectedGroup,
    isCreating,
    handleCreate,
    handleEdit,
    handleClose: handleCloseModal,
  } = useModalManagement<Group>();

  const {
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    calculateTotalPages,
  } = usePaginationState();

  // ==================== CLUB ACTIVO ====================
  // Priorizar: ruta > persistencia
  const activeClubId = routeClubId || persistedClubId;

  const assignmentFilter =
    activeRole === Roles.ADMIN
      ? persistedAssignmentId || user?.assignments?.[0]?.assignmentId || ""
      : undefined;

  const { clubs } = useClubs({
    assignmentId: assignmentFilter,
  });

  // ==================== DATOS DE GRUPOS ====================
  const { groups, meta, isLoading, error, refetch } = useGroups({
    page,
    limit: pageSize,
    clubId: activeClubId,
  });

  // ==================== EFECTOS ====================
  // Resetear a página 1 cuando cambia el club
  useEffect(() => {
    onPageChange(1);
  }, [activeClubId, onPageChange]);

  // Navegar a /clubs cuando cambia la asignación
  useEffect(() => {
    if (previousAssignmentId.current !== undefined && previousAssignmentId.current !== persistedAssignmentId) {
      navigate("/clubs");
    }
    previousAssignmentId.current = persistedAssignmentId;
  }, [persistedAssignmentId, navigate]);

  // ==================== DERIVADOS ====================
  const totalPages = calculateTotalPages(meta?.total, {
    totalPages: meta?.totalPages,
    lastPage: meta?.lastPage,
    limit: meta?.limit,
  });

  const handleSaved = useModalSaveHandler({
    isCreating,
    selectedItem: selectedGroup,
    refetch,
    onModalClose: handleCloseModal,
  });

  const getClubName = (clubId: string): string => {
    return clubs.find((club) => club.id === clubId)?.name || "N/A";
  };

  const pageTitle = activeClubId
    ? `Grupos de ${getClubName(activeClubId)}`
    : "Grupos";

  // Si no hay clubId, mostrar mensaje
  if (!activeClubId) {
    return (
      <>
        <Breadcrumbs title="Grupos">
          <button
            className="btn btn-primary"
            disabled
            aria-label="Crear nuevo grupo"
          >
            <i className="fa fa-plus me-2" />
            &nbsp; Crear grupo
          </button>
        </Breadcrumbs>
        <div className="wrapper wrapper-content animated fadeInRight">
          <IBox title="Grupos">
            <div className="alert alert-warning" role="alert">
              Por favor, selecciona un club para ver sus grupos.
            </div>
          </IBox>
        </div>
      </>
    );
  }

  // ==================== RENDER ====================
  return (
    <>
      <Breadcrumbs title={pageTitle}>
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          aria-label="Crear nuevo grupo"
        >
          <i className="fa fa-plus me-2" />
          &nbsp; Crear grupo
        </button>
      </Breadcrumbs>

      <GroupsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedGroup}
        onSaved={handleSaved}
        defaultClubId={activeClubId}
      />

      <div className="wrapper wrapper-content animated fadeInRight">
        <IBox title="Grupos">
          {isLoading && <p className="text-info">Cargando grupos...</p>}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!isLoading && !error && groups.length === 0 && (
            <p className="text-muted">
              No existen grupos registrados en este club.
            </p>
          )}

          {!isLoading && !error && groups.length > 0 && (
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
                      <th>Club</th>
                      <th>Dirección</th>
                      <th>Atletas</th>
                      <th>Rango de edad</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => (
                      <tr key={group.id}>
                        <td className="align-middle">
                          <strong>{group.name}</strong>
                        </td>
                        <td className="align-middle">
                          {getClubName(group.clubId)}
                        </td>
                        <td className="align-middle">
                          {group.address || "N/A"}
                        </td>
                        <td className="align-middle">
                          {group.maxAthletes
                            ? `${group.enrollments?.length || 0}/${group.maxAthletes}`
                            : `${group.enrollments?.length || 0}`}
                        </td>
                        <td className="align-middle">
                          {group.minAge && group.maxAge
                            ? `${group.minAge} - ${group.maxAge}`
                            : group.minAge
                              ? `${group.minAge}+`
                              : group.maxAge
                                ? `hasta ${group.maxAge}`
                                : "Sin límite"}
                        </td>
                        <td className="align-middle">
                          <span
                            className={`badge bg-${
                              group.status === "ACTIVE"
                                ? "success"
                                : "secondary"
                            }`}
                          >
                            {statusLabels[
                              group.status as keyof typeof statusLabels
                            ] ?? group.status}
                          </span>
                        </td>
                        <td className="align-middle">
                          <button
                            className="btn btn-info"
                            onClick={() => handleEdit(group)}
                            aria-label={`Editar grupo ${group.name}`}
                          >
                            <i className="fa fa-edit" />
                            &nbsp; Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <nav aria-label="Paginación">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                      >
                        Anterior
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <li
                          key={p}
                          className={`page-item ${page === p ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => onPageChange(p)}
                          >
                            {p}
                          </button>
                        </li>
                      ),
                    )}
                    <li
                      className={`page-item ${
                        page === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                      >
                        Siguiente
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </IBox>
      </div>
    </>
  );
};
