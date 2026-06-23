import { useEffect, useMemo, useState } from "react";
import { Modal } from "../components/Modal";

import { useGetUsersQuery } from "../features/users/userApi";
import { useUpdateGroupMutation } from "../features/groups/groupApi";
import { useCoachesManager } from "../features/groups/useCoachesManager";
import { useCoachSearch } from "../features/groups/coaches/useCoachSearch";

import type { User } from "../core/interfaces";

interface CoachesModalProps {
  groupId: string;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const CoachesModal = ({
  groupId,
  open,
  onClose,
  onSaved,
}: CoachesModalProps) => {
  const [updateGroup] = useUpdateGroupMutation();

  // 💾 BACKEND (GUARDADOS)
  const { visibleCoaches, handleRemoveCoach, resetState, refetch } =
    useCoachesManager(groupId);

  // 🔎 SEARCH
  const { search, setSearch, coaches } = useCoachSearch();

  const { data: allCoachesResponse } = useGetUsersQuery({
    role: "COACH",
    page: 1,
    limit: 100,
  });

  // 🧠 DRAFT (PENDIENTES)
  const [selectedCoaches, setSelectedCoaches] = useState<User[]>([]);

  // MAPA COACHES
  const coachMap = useMemo(() => {
    const map = new Map<string, User>();
    allCoachesResponse?.data?.forEach((c) => map.set(c.id, c));
    return map;
  }, [allCoachesResponse]);

  // IDS GUARDADOS
  const savedIds = useMemo(
    () => visibleCoaches.map((c) => c.coachId),
    [visibleCoaches],
  );

  // DISPONIBLES
  const availableCoaches = useMemo(() => {
    return coaches.filter(
      (c) =>
        !savedIds.includes(c.id) && !selectedCoaches.some((s) => s.id === c.id),
    );
  }, [coaches, savedIds, selectedCoaches]);

  // RESET
  useEffect(() => {
    if (open && groupId) {
      resetState();
      setSelectedCoaches([]);
      setSearch("");
    }
  }, [open, groupId, resetState, setSearch]);

  // HANDLERS
  const handleSelect = (coach: User) => {
    setSelectedCoaches((prev) =>
      prev.some((c) => c.id === coach.id) ? prev : [...prev, coach],
    );
  };

  const handleRemoveSelected = (id: string) => {
    setSelectedCoaches((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = async () => {
    const merged = [
      ...new Set([...savedIds, ...selectedCoaches.map((c) => c.id)]),
    ];

    await updateGroup({
      id: groupId,
      coaches: merged,
    }).unwrap();

    await refetch();

    setSelectedCoaches([]);
    onSaved?.();
    onClose();
  };

  const getCoachInfo = (id: string) => coachMap.get(id);

  return (
    <Modal open={open} onClose={onClose} title="Gestión de Coaches" size="lg">
      <div className="mb-3">
        <div className="input-group">
          <input
            className="form-control"
            placeholder="Buscar enfrenador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {search.length >= 2 && (
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-2">Resultados</h3>
          </div>

          {availableCoaches.length > 0 ? (
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Carnet</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {availableCoaches.map((coach) => (
                  <tr key={coach.id}>
                    <td className="align-middle">
                      {coach.name} {coach.lastname}
                    </td>
                    <td className="align-middle">{coach.dni}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-primary btn-sm btn-rounded"
                        onClick={() => handleSelect(coach)}
                      >
                        <i className="fa fa-plus" />
                        &nbsp;Agregar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="alert alert-light border text-center py-2 mb-0">
              No hay coincidencias
            </div>
          )}
        </div>
      )}

      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="mb-0">Asignados</h3>
        </div>

        {visibleCoaches.length > 0 || selectedCoaches.length > 0 ? (
          <table className="table table-sm mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Carnet</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {visibleCoaches.map((c) => {
                const info = getCoachInfo(c.coachId);

                return (
                  <tr key={c.id}>
                    <td className="align-middle">
                      {info ? `${info.name} ${info.lastname}` : c.coachId}
                    </td>

                    <td className="align-middle">{info?.dni ?? "-"}</td>

                    <td className="text-center">
                      <button
                        className="btn btn-danger btn-sm btn-rounded"
                        onClick={() => handleRemoveCoach(c.id)}
                      >
                        <i className="fa fa-trash" />
                        &nbsp;Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}

              {selectedCoaches.map((c) => (
                <tr key={`draft-${c.id}`} className="table-warning">
                  <td className="align-middle">
                    {c.name} {c.lastname}
                    <span className="badge bg-info ms-2">Nuevo</span>
                  </td>

                  <td className="align-middle">{c.dni}</td>

                  <td className="text-center">
                    <button
                      className="btn btn-outline-danger btn-sm btn-rounded"
                      onClick={() => handleRemoveSelected(c.id)}
                    >
                      <i className="fa fa-trash" />
                      &nbsp;Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-light border text-center py-2">
            Sin coaches asignados
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button
          className="btn btn-sm btn-rounded btn-secondary"
          onClick={onClose}
        >
          Cancelar
        </button>

        <button
          className="btn btn-sm btn-rounded btn-primary"
          onClick={handleSave}
        >
          Guardar
        </button>
      </div>
    </Modal>
  );
};
