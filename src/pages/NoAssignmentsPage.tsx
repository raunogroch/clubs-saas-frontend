import { useAuthManager } from "../features/auth/useAuthManager";

export const NoAssignmentsPage = () => {
  const { user } = useAuthManager();

  return (
    <div className="wrapper wrapper-content animated fadeInRight">
      <div className="row no-assignments-row">
        <div className="col-lg-12">
          <div className="ibox float-e-margins no-assignments-box">
            <div className="text-center no-assignments-content">
              <i className="fa fa-exclamation-circle fa-5x text-warning" />
              <h2 className="m-t-md">No tienes asignaciones activas</h2>
              <p className="text-muted">
                {user?.name ?? "Este usuario"} no tiene asignaciones asignadas
                en este momento.
                <br /> Mientras no haya una asignación activa, no podrás acceder
                a las páginas de administración.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
