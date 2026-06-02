import { useState } from "react";
import { Beadcumbs, IBox, PaginationOptions } from "../components";
import { AssignmentModal } from "../modals/AssignmentModal";
import { useAssignments } from "../features/assignments/assignmentHooks";
import { PaginationTable } from "../components/PaginationTable";
import type { Assignment } from "../features/assignments/assignmentApi";

export const AssignmentPage = () => {
  const [selectedAssignment, setSelectedAssignment] = useState<
    Assignment | undefined
  >();
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

  return (
    <>
      <Beadcumbs title="Asignaciones">
        <button
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#assignmentModal"
          onClick={() => setSelectedAssignment(undefined)}
        >
          Crear asignacion
        </button>
        <AssignmentModal
          identifier="assignmentModal"
          data={selectedAssignment}
          onSaved={() => {
            setSelectedAssignment(undefined);
            refetch();
          }}
        />
      </Beadcumbs>
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
                            data-toggle="modal"
                            data-target="#assignmentModal"
                            onClick={() => setSelectedAssignment(assignment)}
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
