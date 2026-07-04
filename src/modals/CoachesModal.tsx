import { useEffect, useMemo, useState } from "react";
import { Modal } from "../components/Modal";

import { useGetUsersQuery } from "../features/users";
import {
  useUpdateGroupMutation,
  useCoachesManager,
  useCoachSearch,
} from "../features/groups";
import { buildCoachesPayload } from "../features/groups";

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

  const { visibleCoaches, handleRemoveCoach, resetState, refetch } =
    useCoachesManager(groupId);

  const { search, setSearch, coaches } = useCoachSearch();

  const { data: allCoachesResponse } = useGetUsersQuery({
    role: "COACH",
    page: 1,
    limit: 100,
  });

  const [selectedCoaches, setSelectedCoaches] = useState<
    SelectedCoachWithRole[]
  >([]);
  const [updatedCoaches, setUpdatedCoaches] = useState<Map<string, CoachRole>>(
    new Map(),
  );
  const [isSaving, setIsSaving] = useState(false);

  const coachMap = useMemo(() => {
    const map = new Map<string, User>();
    allCoachesResponse?.data?.forEach((c: User) => map.set(c.id, c));
    return map;
  }, [allCoachesResponse]);

  const savedIds = useMemo(
    () => visibleCoaches.map((c) => c.coachId),
    [visibleCoaches],
  );

  const availableCoaches = useMemo(() => {
    return coaches.filter(
      (c) =>
        !savedIds.includes(c.id) &&
        !selectedCoaches.some((s) => s.user.id === c.id),
    );
  }, [coaches, savedIds, selectedCoaches]);

  useEffect(() => {
    if (open && groupId) {
      // Deferir para evitar setState síncrono en el effect
      setTimeout(() => {
        resetState();
        setSelectedCoaches([]);
        setSearch("");
        setUpdatedCoaches(new Map());
      }, 0);
    }
  }, [open, groupId, resetState, setSearch]);

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
      const payload = buildCoachesPayload(
        groupId,
        visibleCoaches,
        updatedCoaches,
        selectedCoaches,
      );

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
          <h5 className="mb-0">Asignados</h5>
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
