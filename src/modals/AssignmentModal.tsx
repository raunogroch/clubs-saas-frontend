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
  mode = "full",
}: AssignmentModalProps) => {
  const { form, onClearErrors } = useAssignmentModalForm(open, data);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const { ownerSearch, handleClose } = useModalInitialization(open, data);
  const {
    owners,
    searchContainerRef,
    searchTerm,
    setSearchTerm,
    showSearchResults,
    setShowSearchResults,
    debouncedSearchTerm,
    isLoadingUsers,
    filteredUsers,
    selectedUsers,
    handleAddOwner,
    handleRemoveOwner,
    clearSearch,
  } = ownerSearch;

  const isAdministratorsMode = mode === "administrators";
  const isNameMode = mode === "name";

  const { onSubmit, error, isSaving } = useAssignmentSubmit({
    data,
    administratorIds: owners,
    mode,
    onSaved,
    onClose,
    onReset: () => {
      reset();
      handleClose();
    },
  });

  const isEdit = Boolean(data?.id);
  const modalTitle = isAdministratorsMode
    ? "Actualizar administradores"
    : isNameMode
      ? isEdit
        ? "Actualizar nombre"
        : "Crear asignación"
      : isEdit
        ? "Actualizar asignación"
        : "Crear asignación";

  const modalDescription = isAdministratorsMode
    ? "Selecciona los administradores de la asignación"
    : isNameMode
      ? isEdit
        ? "Modifica únicamente el nombre de la asignación"
        : "Ingresa el nombre de la nueva asignación"
      : isEdit
        ? "Modifica los datos de la asignación"
        : "Crea una nueva asignación";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalTitle}
      description={modalDescription}
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

        {mode !== "administrators" && (
          <InputForm
            title="Nombre"
            name="name"
            register={register}
            errors={errors}
            required="El nombre es obligatorio"
            disabled={isSaving}
          />
        )}

        {mode !== "name" && (
          <>
            <div className="form-group row" ref={searchContainerRef}>
              <label className="col-sm-2 col-form-label">
                Administradores
                <span className="text-danger">*</span>
              </label>
              <div className="col-sm-10">
                <div className="position-relative">
                  <OwnerSearchInput
                    searchTerm={searchTerm}
                    onSearchChange={(term: string) => {
                      setSearchTerm(term);
                      setShowSearchResults(true);
                    }}
                    showResults={showSearchResults}
                    onFocus={() => setShowSearchResults(true)}
                    onClear={clearSearch}
                    disabled={isSaving}
                  />

                  {showSearchResults && (
                    <OwnerSearchResults
                      searchTerm={searchTerm}
                      debouncedSearchTerm={debouncedSearchTerm}
                      isLoadingUsers={isLoadingUsers}
                      filteredUsers={filteredUsers}
                      users={[]}
                      isSaving={isSaving}
                      onSelectUser={handleAddOwner}
                    />
                  )}
                </div>
              </div>
            </div>

            <OwnerSelectionTable
              selectedUsers={selectedUsers}
              isSaving={isSaving}
              onRemove={handleRemoveOwner}
            />
          </>
        )}

        <input type="hidden" {...register("administrators")} />

        <div className="modal-footer mt-4">
          <button
            type="button"
            className="btn btn-sm btn-rounded btn-white"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-sm btn-rounded btn-primary"
            disabled={isSaving || isSubmitting}
          >
            <i className="fa fa-save" />
            &nbsp;
            {isSaving ? (
              <>
                <span className="fa fa-spinner fa-spin me-2" />
                Guardando...
              </>
            ) : isAdministratorsMode ? (
              "Guardar"
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
