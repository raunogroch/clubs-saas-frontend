import { Breadcrumbs, IBox, PaginationOptions } from "../components";
import { AssignmentTable } from "../components/AssignmentTable";
import { AssignmentTableState } from "../components/AssignmentTableState";
import { AssignmentModal } from "../modals/AssignmentModal";
import { useAssignments } from "../features/assignments/assignmentHooks";
import { useAssignmentOwners } from "../core/hooks/useAssignmentOwners";
import { PaginationTable } from "../components/PaginationTable";
import {
  useModalManagement,
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

  const { getOwnerNames } = useAssignmentOwners();

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
  });

  return (
    <>
      <Breadcrumbs title="Asignaciones">
        <button
          className="btn btn-rounded btn-primary"
          onClick={handleCreate}
          aria-label="Crear nueva asignación"
        >
          <i className="fa fa-plus" />
          &nbsp;Crear
        </button>
      </Breadcrumbs>

      <AssignmentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedAssignment}
        onSaved={handleSaved}
      />

      <div className="wrapper wrapper-content animated fadeInRight">
        <IBox title="Asignaciones">
          <AssignmentTableState
            isLoading={isLoading}
            isError={!!isError}
            isEmpty={assignments.length === 0}
          />

          {!isLoading && !isError && assignments.length > 0 && (
            <>
              <div className="d-flex justify-content-end mb-2">
                <PaginationOptions
                  pageSize={pageSize}
                  setPageSize={onPageSizeChange}
                  setPage={onPageChange}
                />
              </div>

              <AssignmentTable
                assignments={assignments}
                page={page}
                pageSize={pageSize}
                getOwnerNames={getOwnerNames}
                onEdit={handleEdit}
              />

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
