import React from "react";

interface FormRowProps {
  label: string;
  children: React.ReactNode;
  error?: string | null;
  className?: string;
}

export const FormRow = ({
  label,
  children,
  error,
  className,
}: FormRowProps) => {
  return (
    <div className={className ?? "mb-3"}>
      <label className="form-label">{label}</label>
      {children}
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
};

export default FormRow;
