import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <h1 className="not-found-code">404</h1>

        <h2 className="not-found-title">Página no encontrada</h2>

        <p className="not-found-description">
          La ruta que intentas acceder no existe o fue movida.
        </p>

        <Link to="/dashboard" className="not-found-button">
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
};
