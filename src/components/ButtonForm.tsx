import type { FormButtonProps } from "../core/interfaces";

export const ButtonForm = ({
  children,
  className,
  onClick,
  type = "button",
  disabled = false,
}: FormButtonProps) => {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
