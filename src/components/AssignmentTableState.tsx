import type { AssignmentTableStateProps } from "../core/interfaces";
export const AssignmentTableState = (props: AssignmentTableStateProps) => {
  const { isLoading, isError, isEmpty } = props;

  if (isLoading) {
    return <p>Cargando asignaciones...</p>;
  }

  if (isError) {
    return <p className="text-danger">Error al cargar las asignaciones.</p>;
  }

  if (isEmpty) {
    return <p>No hay asignaciones registradas.</p>;
  }

  return null;
};
