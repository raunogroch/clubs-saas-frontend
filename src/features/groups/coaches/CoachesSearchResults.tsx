import type { User } from "../../../core/interfaces/User";

interface Props {
  coaches: User[];
  onSelect: (coach: User) => void;
  isLoading: boolean;
}

export const CoachesSearchResults = ({
  coaches,
  onSelect,
  isLoading,
}: Props) => {
  if (isLoading) {
    return <div className="p-2">Buscando coaches...</div>;
  }

  if (!coaches.length) {
    return <div className="p-2 text-muted">Sin resultados</div>;
  }

  return (
    <div className="search-results border rounded bg-white">
      {coaches.map((coach) => (
        <div
          key={coach.id}
          className="p-2 cursor-pointer hover-bg"
          onClick={() => onSelect(coach)}
        >
          <div>
            <strong>
              {coach.name} {coach.lastname}
            </strong>
          </div>

          <div className="text-muted">DNI: {coach.dni}</div>

          {coach.username && (
            <div className="text-muted">@{coach.username}</div>
          )}
        </div>
      ))}
    </div>
  );
};
