import type {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  Path,
} from "react-hook-form";

interface InputFormProps<T extends FieldValues> {
  title?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  required?: string;
  disabled?: boolean;
  placeholder?: string;
  type?: "text" | "date" | "select" | "number" | "textarea";
  options?: Array<{ value: string; label: string }>;
}

export const InputForm = <T extends FieldValues>({
  title,
  name,
  register,
  errors,
  required,
  disabled = false,
  placeholder = "",
  type = "text",
  options = [],
}: InputFormProps<T>) => {
  return (
    <div className="form-group row">
      {title && <label className="col-sm-2 col-form-label">{title}</label>}

      <div className={title ? "col-sm-10" : "col-12"}>
        {type === "select" ? (
          <select
            className="form-control"
            {...register(name, {
              required,
            })}
            disabled={disabled}
          >
            <option value="">Seleccionar...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            className="form-control"
            placeholder={placeholder}
            rows={4}
            {...register(name, {
              required,
            })}
            disabled={disabled}
          />
        ) : (
          <input
            type={type}
            className="form-control"
            {...register(name, {
              required,
            })}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}

        {errors[name] && (
          <span className="text-danger">{String(errors[name]?.message)}</span>
        )}
      </div>
    </div>
  );
};
