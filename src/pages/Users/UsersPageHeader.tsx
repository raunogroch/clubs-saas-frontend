import { Breadcumbs } from "../../components";

interface UsersPageHeaderProps {
  onCreateClick: () => void;
}

/**
 * Encapsula el header de la página de usuarios
 * (Breadcrumbs + botón Crear)
 *
 * Principio SOLID:
 * - SRP: Una sola responsabilidad - renderizar el header
 */
export const UsersPageHeader = ({ onCreateClick }: UsersPageHeaderProps) => (
  <Breadcumbs
    title="Usuarios"
    items={[{ label: "Inicio", route: "/dashboard" }, { label: "Usuarios" }]}
  >
    <button
      className="btn btn-rounded btn-primary"
      onClick={onCreateClick}
      aria-label="Crear"
    >
      <i className="fa fa-plus" />
      &nbsp;Crear
    </button>
  </Breadcumbs>
);
