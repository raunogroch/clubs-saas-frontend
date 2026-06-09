import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";

import { Roles } from "../common/enums";
import { rolesLabels } from "../common/translations";
import type { UserFormInputs } from "../core/types";

interface RolesFieldArrayProps {
  fields: FieldArrayWithId<UserFormInputs, "roles", "id">[];
  append: UseFieldArrayAppend<UserFormInputs, "roles">;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<UserFormInputs>;
  isSaving: boolean;
  error?: string; // Error message opcional
}

export const RolesFieldArray = ({
  fields,
  append,
  remove,
  register,
  isSaving,
  error,
}: RolesFieldArrayProps) => {
  const handleAddRole = () => {
    append({ role: "" });
  };

  const handleRemoveRole = (index: number) => {
    // Asegurar que siempre haya al menos un campo vacío
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        Roles <span className="text-danger">*</span>
      </label>

      <div className="roles-container">
        {fields.map((field, index) => (
          <div key={field.id} className="input-group mb-2">
            <select
              className={`form-control ${error ? "is-invalid" : ""}`}
              {...register(`roles.${index}.role`, {
                required: "Seleccione un rol",
              })}
              disabled={isSaving}
              aria-label={`Rol ${index + 1}`}
            >
              <option value="">-- Seleccionar rol --</option>

              {Object.values(Roles).map((role) => (
                <option key={role} value={role}>
                  {rolesLabels[role]}
                </option>
              ))}
            </select>

            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => handleRemoveRole(index)}
                disabled={isSaving || fields.length === 1}
                aria-label={`Eliminar rol ${index + 1}`}
                title="Eliminar rol"
              >
                <i className="fa fa-trash" />
              </button>
            </div>
          </div>
        ))}

        {/* Mensaje de error */}
        {error && <div className="invalid-feedback d-block">{error}</div>}
      </div>

      {/* Botón para agregar rol */}
      <button
        type="button"
        className="btn btn-sm btn-success mt-2"
        onClick={handleAddRole}
        disabled={isSaving}
        aria-label="Agregar nuevo rol"
      >
        <i className="fa fa-plus me-2" />
        Agregar rol
      </button>
    </div>
  );
};
