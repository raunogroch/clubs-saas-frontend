interface ButtonsProps {
  name: string;
  type: "button" | "submit" | "reset";
}
export const ButtonsForm = ({ name, type }: ButtonsProps) => {
  return (
    <div className="modal-footer">
      <button type="button" className="btn btn-white" data-dismiss="modal">
        Cerrar
      </button>

      <button type={type} className="btn btn-primary">
        {name}
      </button>
    </div>
  );
};
