import { useEffect, useMemo, useState } from "react";
import { Modal } from "../components/Modal";

import { useGetUsersQuery } from "../features/users/userApi";
import { useUpdateGroupMutation } from "../features/groups/groupApi";
import { useCoachesManager } from "../features/groups/useCoachesManager";
import { useCoachSearch } from "../features/groups/coaches/useCoachSearch";

import { CoachSearchBar } from "./coaches/CoachSearchBar";
import { CoachSearchResults } from "./coaches/CoachSearchResults";
import { CoachAssignedList } from "./coaches/CoachAssignedList";
import { CoachesModalActions } from "./coaches/CoachesModalActions";

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
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    try {
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
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Gestión de Coaches" size="lg">
      {/* BÚSQUEDA */}
      <CoachSearchBar value={search} onChange={setSearch} />

      {/* RESULTADOS DE BÚSQUEDA */}
      {search.length >= 2 && (
        <CoachSearchResults
          coaches={availableCoaches}
          onAddCoach={handleSelect}
        />
      )}

      {/* COACHES ASIGNADOS */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="mb-0">Asignados</h3>
        </div>

        <CoachAssignedList
          savedCoaches={visibleCoaches}
          newCoaches={selectedCoaches}
          coachMap={coachMap}
          onChangeRoleSavedCoach={handleChangeRoleForSavedCoach}
          onChangeRoleNewCoach={handleChangeRoleForNewCoach}
          onRemoveSavedCoach={handleRemoveCoach}
          onRemoveNewCoach={handleRemoveSelected}
        />
      </div>

      {/* ACCIONES */}
      <CoachesModalActions
        onCancel={onClose}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </Modal>
  );
};
