import { useCallback, useState } from "react";
import { Breadcrumbs, IBox, PaginationOptions } from "../components";
import { AssignmentModal } from "../modals/AssignmentModal";
import { useAssignments } from "../features/assignments/assignmentHooks";
import { PaginationTable } from "../components/PaginationTable";
import type { Assignment } from "../core/interfaces";

export const AssignmentPage = () => {
  const [selectedAssignment, setSelectedAssignment] = useState<
    Assignment | undefined
  >();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const totalPages =
    meta?.totalPages ??
    meta?.lastPage ??
    (meta?.limit ? Math.ceil((meta?.total || 0) / meta.limit) : 1);

  const handleCreate = useCallback(() => {
    setSelectedAssignment(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedAssignment(undefined);
  }, []);

  const handleSaved = useCallback(async () => {
    await refetch();
    handleCloseModal();
  }, [refetch, handleCloseModal]);

  return (
    <>
      <Breadcrumbs title="Asignaciones">
        <button
          className="btn btn-primary"
          onClick={handleCreate}
          aria-label="Crear nueva asignación"
        >
          <i className="fa fa-plus me-2" />
          Crear asignación
        </button>
      </Breadcrumbs>

      {/* Modal de crear/editar asignación */}
      <AssignmentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedAssignment}
        onSaved={handleSaved}
      />
      <div className="wrapper wrapper-content animated fadeInRight">
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
                    setPageSize={setPageSize}
                    setPage={setPage}
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
                        <td>{(page - 1) * pageSize + index + 1}</td>
                        <td>{assignment.name}</td>
                        <td>{assignment.owners?.join(", ") || "N/A"}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(assignment)}
                            aria-label={`Editar asignación ${assignment.name}`}
                          >
                            <i className="fa fa-edit me-1" />
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
                onPageChange={(newPage) => setPage(newPage)}
              />
            </>
          )}
        </IBox>
      </div>
    </>
  );
};
