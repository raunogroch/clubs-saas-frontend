import type {
  OwnerSearchInputProps,
  OwnerSearchResultsProps,
  OwnerSelectionTableProps,
} from "../core/interfaces";

export const OwnerSearchInput = (props: OwnerSearchInputProps) => {
  const { searchTerm, onSearchChange, onFocus, disabled } = props;

  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar por nombre, apellido, DNI o usuario..."
        value={searchTerm}
        onChange={(e) => {
          onSearchChange(e.target.value);
        }}
        onFocus={onFocus}
        disabled={disabled}
        autoComplete="off"
      />
    </div>
  );
};

export const OwnerSearchResults = (props: OwnerSearchResultsProps) => {
  const {
    searchTerm,
    debouncedSearchTerm,
    isLoadingUsers,
    filteredUsers,
    users,
    isSaving,
    onSelectUser,
  } = props;
  return (
    <div
      className="border border-1 bg-white rounded mt-1 shadow-sm"
      style={{
        maxHeight: "300px",
        overflowY: "auto",
        minWidth: "100%",
        zIndex: 1050,
      }}
    >
      {searchTerm === "" ? (
        <div className="p-2 text-muted text-center">
          <small>Escribe para buscar usuarios ADMIN</small>
        </div>
      ) : searchTerm !== debouncedSearchTerm ? (
        <div className="p-2 text-center">
          <span className="fa fa-spinner fa-spin me-2" />
          <small>Buscando...</small>
        </div>
      ) : isLoadingUsers ? (
        <div className="p-2 text-center">
          <span className="fa fa-spinner fa-spin mx-2" />
          <small>Cargando resultados...</small>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-2 text-muted text-center">
          <small>
            {users.length === 0
              ? "No hay usuarios ADMIN disponibles"
              : "No hay resultados que coincidan"}
          </small>
        </div>
      ) : (
        <div>
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              type="button"
              className="w-100 text-start p-2 border-0 bg-white"
              style={{ cursor: "pointer" }}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelectUser(user.id, user);
              }}
              disabled={isSaving}
            >
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <div className="fw-500 small">
                    {user.lastname}, {user.name}
                  </div>
                  <small className="text-muted">{user.dni}</small>
                </div>
                <span className="fa fa-plus text-primary ms-2" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const OwnerSelectionTable = (props: OwnerSelectionTableProps) => {
  const { selectedUsers, isSaving, onRemove } = props;
  if (selectedUsers.length === 0) return null;

  return (
    <div className="form-group row">
      <label className="col-sm-2 col-form-label">Seleccionados:</label>

      <div className="col-sm-12">
        <div className="table-responsive">
          <table className="table table-sm table-hover mb-0">
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Carnet</th>
                <th style={{ width: "50px" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {selectedUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="fw-600">
                      {user.lastname}, {user.name}
                    </div>
                  </td>
                  <td>{user.dni}</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => onRemove(user.id)}
                      disabled={isSaving}
                      title="Remover"
                    >
                      <span className="fa fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
