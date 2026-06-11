import { useAuthManager } from "../features/auth/useAuthManager";

export const NoAssignmentsPage = () => {
  const { user } = useAuthManager();

  return (
    <div className="wrapper wrapper-content animated fadeInRight">
      <div className="row" style={{ minHeight: "70vh", alignItems: "center" }}>
        <div className="col-lg-12">
          <div className="ibox float-e-margins" style={{ marginBottom: 0 }}>
            <div
              className="text-center"
              style={{
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "24px",
              }}
            >
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
