import type {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  Path,
} from "react-hook-form";

interface InputFormProps<T extends FieldValues> {
  title: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  required?: string;
}

export const InputForm = <T extends FieldValues>({
  title,
  name,
  register,
  errors,
  required,
}: InputFormProps<T>) => {
  return (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">{title}</label>

      <div className="col-sm-10">
        <input
          type="text"
          className="form-control"
          {...register(name, {
            required,
          })}
        />

        {errors[name] && (
          <span className="text-danger">{String(errors[name]?.message)}</span>
        )}
      </div>
    </div>
  );
};
