import { ButtonsForm } from "./ButtonsForm";

interface ModalProps {
  title: string;
  identifier: string;
  description?: string;
  children: React.ReactNode;
  buttonName: string;
  size?: "sm" | "lg" | "xl";
}

export const Modal = (props: ModalProps) => {
  return (
    <div
      className="modal inmodal"
      id={props.identifier}
      role="dialog"
      aria-hidden="true"
    >
      <div
        className={`modal-dialog ${props.size ? `modal-${props.size}` : ""}`}
      >
        <div className="modal-content animated flipInY">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">{props.title}</h4>
            <small className="font-bold">{props.description}</small>
          </div>
          <div className="modal-body">{props.children}</div>
          <ButtonsForm name={props.buttonName} type="submit" />
        </div>
      </div>
    </div>
  );
};
