interface Props {
  coaches: any[];
  onRemove: (id: string) => void;
}

export const CoachesSelectionTable = ({ coaches, onRemove }: Props) => {
  if (!coaches.length) {
    return <p className="text-muted">No hay coaches seleccionados</p>;
  }

  return (
    <table className="table table-sm mt-3">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>DNI</th>
          <th />
        </tr>
      </thead>

      <tbody>
        {coaches.map((coach) => (
          <tr key={coach.id}>
            <td>
              {coach.name} {coach.lastname}
            </td>

            <td>{coach.dni}</td>

            <td>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onRemove(coach.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
