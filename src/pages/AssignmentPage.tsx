import { Breadcrumbs, IBox, PaginationOptions, Alert } from "../components";
import { AssignmentModal } from "../modals/AssignmentModal";
import { useAssignments } from "../features/assignments/assignmentHooks";
import { PaginationTable } from "../components/PaginationTable";
import {
  useModalManagement,
  useAlert,
  usePaginationState,
  useModalSaveHandler,
} from "../core/hooks";
import type { Assignment } from "../core/interfaces";

export const AssignmentPage = () => {
  const {
    isOpen: isModalOpen,
    selectedItem: selectedAssignment,
    isCreating,
    handleCreate,
    handleEdit,
    handleClose: handleCloseModal,
  } = useModalManagement<Assignment>();

  const {
    isVisible: showAlert,
    message: alertMessage,
    showAlert: showAlertMessage,
  } = useAlert(5000);

  const {
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    calculateTotalPages,
  } = usePaginationState();

  const {
    assignments,
    meta,
    isLoading,
    error: isError,
    refetch,
  } = useAssignments({
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
    selectedItem: selectedAssignment,
    refetch,
    onModalClose: handleCloseModal,
    onShowAlert: showAlertMessage,
  });

  return (
    <>
      <Breadcrumbs title="Asignaciones">
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          aria-label="Crear nueva asignación"
        >
          <i className="fa fa-plus me-2" />
          &nbsp;Crear asignación
        </button>
      </Breadcrumbs>

      <AssignmentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedAssignment}
        onSaved={handleSaved}
      />
      <div className="wrapper wrapper-content animated fadeInRight">
        {showAlert && <Alert type="success" message={alertMessage} />}
        <IBox title="Asignaciones">
          {isLoading && <p>Cargando asignaciones...</p>}
          {isError && (
            <p className="text-danger">Error al cargar las asignaciones.</p>
          )}
          {!isLoading && !isError && assignments.length === 0 && (
            <p>No hay asignaciones registradas.</p>
          )}
          {!isLoading && !isError && assignments.length > 0 && (
            <>
              <div className="table-responsive">
                <div className="d-flex justify-content-end mb-2">
                  <PaginationOptions
                    pageSize={pageSize}
                    setPageSize={onPageSizeChange}
                    setPage={onPageChange}
                  />
                </div>
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
                    {assignments.map((assignment, index) => (
                      <tr key={assignment.id}>
                        <td className="align-middle">
                          {(page - 1) * pageSize + index + 1}
                        </td>
                        <td className="align-middle">{assignment.name}</td>
                        <td className="align-middle">
                          {assignment.owners?.join(", ") || "N/A"}
                        </td>
                        <td className="align-middle">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(assignment)}
                            aria-label={`Editar asignación ${assignment.name}`}
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
                onPageChange={(newPage) => onPageChange(newPage)}
              />
            </>
          )}
        </IBox>
      </div>
    </>
  );
};
