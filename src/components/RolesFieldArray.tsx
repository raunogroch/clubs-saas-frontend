import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

import type { UserFormInputs } from "../core/types";

interface RolesFieldArrayProps {
  fields: FieldArrayWithId<UserFormInputs, "roles", "id">[];
  append: UseFieldArrayAppend<UserFormInputs, "roles">;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<UserFormInputs>;
  isSaving: boolean;
  error?: string;
  roleOptions: {
    value: string;
    label: string;
  }[];
  lockedIndexes?: number[];
}

export const RolesFieldArray = ({
  fields,
  append,
  remove,
  register,
  isSaving,
  error,
  roleOptions,
  lockedIndexes = [],
}: RolesFieldArrayProps) => {
  const handleAddRole = () => {
    append({ role: "" });
  };

  const handleRemoveRole = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">
        Roles <span className="text-danger">*</span>
      </label>

      <div className="col-sm-10">
        <div className="roles-container">
          {fields.map((field, index) => {
            const isLocked = lockedIndexes.includes(index);

            return (
              <div key={field.id} className="input-group mb-2">
                <select
                  className={`form-control h-auto ${error ? "is-invalid" : ""}`}
                  {...register(`roles.${index}.role`, {
                    required: "Seleccione un rol",
                  })}
                  disabled={isSaving || isLocked}
                  aria-label={`Rol ${index + 1}`}
                  title={isLocked ? "Este rol está protegido" : undefined}
                >
                  <option value="">-- Seleccionar rol --</option>

                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>

                <div className="input-group-append">
                  {isLocked ? (
                    <span
                      className="input-group-text text-warning"
                      title="Este rol no puede quitarse"
                    >
                      <i className="fa fa-lock" />
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveRole(index)}
                      disabled={isSaving || fields.length === 1}
                      aria-label={`Eliminar rol ${index + 1}`}
                      title="Eliminar rol"
                    >
                      <i className="fa fa-trash" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {error && <div className="invalid-feedback d-block">{error}</div>}
        </div>

        <button
          type="button"
          className="btn btn-rounded btn-sm btn-success"
          onClick={handleAddRole}
          disabled={isSaving}
          aria-label="Agregar nuevo rol"
        >
          <i className="fa fa-plus me-2" />
          &nbsp;Agregar rol
        </button>
      </div>
    </div>
  );
};
