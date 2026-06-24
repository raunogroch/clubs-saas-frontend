interface CoachSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * CoachSearchBar Component
 *
 * Responsabilidad única: Renderizar barra de búsqueda para coaches
 * DIP: Recibe el valor y onChange como props (no maneja lógica)
 */
export const CoachSearchBar = ({
  value,
  onChange,
  placeholder = "Buscar enfrenador...",
}: CoachSearchBarProps) => {
  return (
    <div className="mb-3">
      <div className="input-group">
        <input
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};
