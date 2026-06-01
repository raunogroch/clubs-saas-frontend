import { useForm, type SubmitHandler } from "react-hook-form";
import { InputForm, Modal } from "../components";

type Inputs = {
  name: string;
  admins: string;
};

interface AssignmentModalProps {
  identifier: string;
}

export const AssignmentModal = (props: AssignmentModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal
        title="Crear asignacion"
        identifier={props.identifier}
        buttonName="Crear"
      >
        <InputForm
          title="Nombre"
          name="name"
          register={register}
          errors={errors}
          required="El nombre es obligatorio"
        />

        <InputForm
          title="Propietarios"
          name="admins"
          register={register}
          errors={errors}
        />
      </Modal>
    </form>
  );
};
