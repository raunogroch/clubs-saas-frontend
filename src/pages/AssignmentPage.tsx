import { Beadcumbs } from "../components";
import { AssignmentModal } from "../modals/AssignmentModal";

export const AssignmentPage = () => {
  return (
    <>
      <Beadcumbs title="Asignaciones">
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#assignmentModal"
        >
          Crear asignacion
        </button>
        <AssignmentModal identifier="assignmentModal" />
      </Beadcumbs>
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-lg-12">
            <div className="ibox ">
              <div className="ibox-title">
                <h5>Asignaciones</h5>
              </div>
              <div className="ibox-content">
                <p>Aquí se mostrarán las asignaciones.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
