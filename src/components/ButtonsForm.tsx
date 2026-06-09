interface ButtonsProps {
  name: string;
  type: "button" | "submit" | "reset";
}

export const ButtonsForm = ({ name, type }: ButtonsProps) => {
  return (
    <div className="modal-footer">
      <button type={type} className="btn btn-primary">
        {name}
      </button>
    </div>
  );
};
