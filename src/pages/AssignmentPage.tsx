import { useCallback, useState } from "react";
import { Breadcumbs, IBox, PaginationOptions } from "../components";
import { AssignmentTable } from "../components/AssignmentTable";
import { AssignmentTableState } from "../components/AssignmentTableState";
import { AssignmentModal } from "../modals/AssignmentModal";
import { useAssignments } from "../features/assignments";
import { useAssignmentOwners } from "../core/hooks/useAssignmentOwners";
import { PaginationTable } from "../components/PaginationTable";
import {
  useModalManagement,
  usePaginationState,
  useModalSaveHandler,
} from "../core/hooks";
import type { Assignment, AssignmentModalMode } from "../core/interfaces";

export const AssignmentPage = () => {
  const {
    isOpen: isModalOpen,
    selectedItem: selectedAssignment,
    isCreating,
    handleCreate,
    handleEdit,
    handleClose,
  } = useModalManagement<Assignment>();

  const [modalMode, setModalMode] = useState<AssignmentModalMode>("full");

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

  const { getAdministratorNames } = useAssignmentOwners();

  const handleCreateAssignment = useCallback(() => {
    setModalMode("name");
    handleCreate();
  }, [handleCreate]);

  const handleEditName = useCallback(
    (assignment: Assignment) => {
      setModalMode("name");
      handleEdit(assignment);
    },
    [handleEdit],
  );

  const handleManageAdministrators = useCallback(
    (assignment: Assignment) => {
      setModalMode("administrators");
      handleEdit(assignment);
    },
    [handleEdit],
  );

  const handleCloseModal = useCallback(() => {
    setModalMode("full");
    handleClose();
  }, [handleClose]);

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
      <Breadcumbs
        title="Asignaciones"
        items={[
          { label: "Inicio", route: "/dashboard" },
          { label: "Asignaciones" },
        ]}
      >
        <button
          className="btn btn-rounded btn-primary"
          onClick={handleCreateAssignment}
          aria-label="Crear nueva asignación"
        >
          <i className="fa fa-plus" />
          &nbsp;Crear
        </button>
      </Breadcumbs>

      <AssignmentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        data={selectedAssignment}
        onSaved={handleSaved}
        mode={modalMode}
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
                getAdministratorNames={getAdministratorNames}
                onEdit={handleEditName}
                onManageAdministrators={handleManageAdministrators}
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
