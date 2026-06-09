import { InputForm, Modal } from "../components";
import {
  OwnerSearchInput,
  OwnerSearchResults,
  OwnerSelectionTable,
} from "../components/OwnerSearch";
import { useAssignmentModalForm } from "../hooks/useAssignmentModalForm";
import { useAssignmentSubmit } from "../hooks/useAssignmentSubmit";
import { useModalInitialization } from "../hooks/useModalInitialization";
import type { AssignmentModalProps } from "../core/interfaces";

export const AssignmentModal = ({
  open,
  onClose,
  data,
  onSaved,
}: AssignmentModalProps) => {
  const { form, onClearErrors } = useAssignmentModalForm(open, data);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const { ownerSearch, handleClose } = useModalInitialization(open, data);

  const { onSubmit, error, isSaving } = useAssignmentSubmit({
    data,
    ownerIds: ownerSearch.owners,
    onSaved,
    onClose,
    onReset: () => {
      reset();
      handleClose();
    },
  });

  const isEdit = Boolean(data?.id);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Actualizar asignación" : "Crear asignación"}
      description={
        isEdit
          ? "Modifica los datos de la asignación"
          : "Crea una nueva asignación"
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            <button
              type="button"
              className="close"
              onClick={onClearErrors}
              aria-label="Cerrar"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <strong>Error:</strong>{" "}
            {typeof error === "string" ? error : "Error al guardar asignación"}
          </div>
        )}

        <InputForm
          title="Nombre"
          name="name"
          register={register}
          errors={errors}
          required="El nombre es obligatorio"
          disabled={isSaving}
        />

        <div className="form-group row" ref={ownerSearch.searchContainerRef}>
          <label className="col-sm-2 col-form-label">
            Propietarios
            <span className="text-danger">*</span>
          </label>
          <div className="col-sm-10">
            <div className="position-relative">
              <OwnerSearchInput
                searchTerm={ownerSearch.searchTerm}
                onSearchChange={(term) => {
                  ownerSearch.setSearchTerm(term);
                  ownerSearch.setShowSearchResults(true);
                }}
                showResults={ownerSearch.showSearchResults}
                onFocus={() => ownerSearch.setShowSearchResults(true)}
                onClear={ownerSearch.clearSearch}
                disabled={isSaving}
              />

              {ownerSearch.showSearchResults && (
                <OwnerSearchResults
                  searchTerm={ownerSearch.searchTerm}
                  debouncedSearchTerm={ownerSearch.debouncedSearchTerm}
                  isLoadingUsers={ownerSearch.isLoadingUsers}
                  filteredUsers={ownerSearch.filteredUsers}
                  users={[]}
                  isSaving={isSaving}
                  onSelectUser={ownerSearch.handleAddOwner}
                />
              )}
            </div>
          </div>
        </div>

        <OwnerSelectionTable
          selectedUsers={ownerSearch.selectedUsers}
          isSaving={isSaving}
          onRemove={ownerSearch.handleRemoveOwner}
        />

        <input type="hidden" {...register("owners")} />

        <div className="modal-footer mt-4">
          <button
            type="button"
            className="btn btn-white"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSaving || isSubmitting}
          >
            {isSaving ? (
              <>
                <span className="fa fa-spinner fa-spin me-2" />
                Guardando...
              </>
            ) : isEdit ? (
              "Actualizar"
            ) : (
              "Crear"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
