import { useEffect, useMemo, useState } from "react";
import { Modal } from "../components/Modal";

import { useGetUsersQuery } from "../features/users/userApi";
import { useUpdateGroupMutation } from "../features/groups/groupApi";
import { useCoachesManager } from "../features/groups/useCoachesManager";
import { useCoachSearch } from "../features/groups/coaches/useCoachSearch";

import type { User } from "../core/interfaces";
import type { CoachRole } from "../core/interfaces/Groups";

interface SelectedCoachWithRole {
  user: User;
  role: CoachRole;
}

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
  const [selectedCoaches, setSelectedCoaches] = useState<
    SelectedCoachWithRole[]
  >([]);
  const [updatedCoaches, setUpdatedCoaches] = useState<Map<string, CoachRole>>(
    new Map(),
  );

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
        !savedIds.includes(c.id) &&
        !selectedCoaches.some((s) => s.user.id === c.id),
    );
  }, [coaches, savedIds, selectedCoaches]);

  // RESET
  useEffect(() => {
    if (open && groupId) {
      resetState();
      setSelectedCoaches([]);
      setSearch("");
      setUpdatedCoaches(new Map());
    }
  }, [open, groupId, resetState, setSearch]);

  // HANDLERS
  const handleSelect = (coach: User) => {
    setSelectedCoaches((prev) => [
      ...prev,
      { user: coach, role: "HEAD_COACH" },
    ]);
    setSearch("");
  };

  const handleRemoveSelected = (coachId: string) => {
    setSelectedCoaches((prev) => prev.filter((c) => c.user.id !== coachId));
  };

  const handleChangeRoleForSavedCoach = (
    coachId: string,
    newRole: CoachRole,
  ) => {
    setUpdatedCoaches((prev) => new Map(prev).set(coachId, newRole));
  };

  const handleChangeRoleForNewCoach = (coachId: string, newRole: CoachRole) => {
    setSelectedCoaches((prev) =>
      prev.map((c) => (c.user.id === coachId ? { ...c, role: newRole } : c)),
    );
  };

  const handleSave = async () => {
    const existingCoaches = visibleCoaches.map((c) => ({
      coachId: c.coachId,
      role: updatedCoaches.get(c.coachId) || c.role || "ASSISTANT_COACH",
    }));

    const newCoaches = selectedCoaches.map((c) => ({
      coachId: c.user.id,
      role: c.role,
    }));

    const payload = {
      id: groupId,
      coaches: [...existingCoaches, ...newCoaches],
    };

    console.log("📤 Payload enviado al backend:", payload);

    await updateGroup(payload).unwrap();

    await refetch();

    setSelectedCoaches([]);
    setUpdatedCoaches(new Map());
    onSaved?.();
    onClose();
  };

  const getCoachInfo = (id: string) => coachMap.get(id);

  return (
    <Modal open={open} onClose={onClose} title="Gestión de Coaches" size="lg">
      {/* BÚSQUEDA */}
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

      {/* RESULTADOS DE BÚSQUEDA */}
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

      {/* COACHES ASIGNADOS */}
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
                <th>Rol</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {visibleCoaches.map((c) => {
                const info = getCoachInfo(c.coachId);
                const currentRole = updatedCoaches.get(c.coachId) || c.role;
                const roleLabel =
                  currentRole === "HEAD_COACH"
                    ? "Entrenador Principal"
                    : "Entrenador Asistente";

                return (
                  <tr key={c.id}>
                    <td className="align-middle">
                      {info ? `${info.name} ${info.lastname}` : c.coachId}
                    </td>

                    <td className="align-middle">{info?.dni ?? "-"}</td>

                    <td className="align-middle">
                      <select
                        className="form-control"
                        value={currentRole || "ASSISTANT_COACH"}
                        onChange={(e) =>
                          handleChangeRoleForSavedCoach(
                            c.coachId,
                            e.target.value as CoachRole,
                          )
                        }
                      >
                        {(["HEAD_COACH", "ASSISTANT_COACH"] as const).map(
                          (role) => (
                            <option key={role} value={role}>
                              {role === "HEAD_COACH"
                                ? "Entrenador Principal"
                                : "Entrenador Asistente"}
                            </option>
                          ),
                        )}
                      </select>
                    </td>

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

              {selectedCoaches.map((c) => {
                const roleLabel =
                  c.role === "HEAD_COACH"
                    ? "Entrenador Principal"
                    : "Entrenador Asistente";

                return (
                  <tr key={`draft-${c.user.id}`} className="table-warning">
                    <td className="align-middle">
                      {c.user.name} {c.user.lastname}
                      <span className="badge bg-info ms-2">Nuevo</span>
                    </td>

                    <td className="align-middle">{c.user.dni}</td>

                    <td className="align-middle">
                      <select
                        className="form-control"
                        value={c.role}
                        onChange={(e) =>
                          handleChangeRoleForNewCoach(
                            c.user.id,
                            e.target.value as CoachRole,
                          )
                        }
                      >
                        {(["HEAD_COACH", "ASSISTANT_COACH"] as const).map(
                          (role) => (
                            <option key={role} value={role}>
                              {role === "HEAD_COACH"
                                ? "Entrenador Principal"
                                : "Entrenador Asistente"}
                            </option>
                          ),
                        )}
                      </select>
                    </td>

                    <td className="text-center">
                      <button
                        className="btn btn-outline-danger btn-sm btn-rounded"
                        onClick={() => handleRemoveSelected(c.user.id)}
                      >
                        <i className="fa fa-trash" />
                        &nbsp;Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
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
