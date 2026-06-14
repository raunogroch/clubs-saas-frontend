import { useCallback, useEffect, useState } from "react";

const ASSIGNMENT_ID_STORAGE_KEY = "activeAssignmentId";
const CLUB_ID_STORAGE_KEY = "activeClubId";
const LEGACY_ASSIGNMENT_STORAGE_KEY = "activeAssignment";
const ASSIGNMENT_CHANGED_EVENT = "activeAssignmentId:changed";
const CLUB_CHANGED_EVENT = "activeClubId:changed";

const normalizeAssignmentId = (value: unknown): string => {
  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return "";
    }

    try {
      const parsed = JSON.parse(trimmed) as
        | { assignmentId?: unknown; id?: unknown }
        | unknown;

      if (parsed && typeof parsed === "object") {
        const candidate =
          (parsed as { assignmentId?: unknown }).assignmentId ??
          (parsed as { id?: unknown }).id;

        return typeof candidate === "string" && candidate.trim().length > 0
          ? candidate.trim()
          : "";
      }
    } catch {
      // Keep the raw string if it is not valid JSON.
    }

    return trimmed;
  }

  if (value && typeof value === "object") {
    const candidate =
      (value as { assignmentId?: unknown }).assignmentId ??
      (value as { id?: unknown }).id;

    return typeof candidate === "string" && candidate.trim().length > 0
      ? candidate.trim()
      : "";
  }

  return "";
};

export const useAssignmentPersistence = () => {
  const getStoredAssignmentId = (): string => {
    try {
      const savedAssignmentId = localStorage.getItem(ASSIGNMENT_ID_STORAGE_KEY);
      const legacyAssignment = localStorage.getItem(
        LEGACY_ASSIGNMENT_STORAGE_KEY,
      );

      return normalizeAssignmentId(savedAssignmentId ?? legacyAssignment ?? "");
    } catch {
      return "";
    }
  };

  const getStoredClubId = (): string => {
    try {
      return localStorage.getItem(CLUB_ID_STORAGE_KEY)?.trim() || "";
    } catch {
      return "";
    }
  };

  const [assignmentId, setAssignmentIdState] = useState<string>(
    getStoredAssignmentId,
  );
  const [clubId, setClubIdState] = useState<string>(getStoredClubId);

  const syncAssignmentId = useCallback(() => {
    setAssignmentIdState(getStoredAssignmentId());
  }, []);

  const syncClubId = useCallback(() => {
    setClubIdState(getStoredClubId());
  }, []);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key === ASSIGNMENT_ID_STORAGE_KEY ||
        event.key === LEGACY_ASSIGNMENT_STORAGE_KEY
      ) {
        syncAssignmentId();
      }

      if (event.key === CLUB_ID_STORAGE_KEY) {
        syncClubId();
      }
    };

    const handleAssignmentChange = () => {
      syncAssignmentId();
    };

    const handleClubChange = () => {
      syncClubId();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(ASSIGNMENT_CHANGED_EVENT, handleAssignmentChange);
    window.addEventListener(CLUB_CHANGED_EVENT, handleClubChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        ASSIGNMENT_CHANGED_EVENT,
        handleAssignmentChange,
      );
      window.removeEventListener(CLUB_CHANGED_EVENT, handleClubChange);
    };
  }, [syncAssignmentId, syncClubId]);

  const setAssignmentId = useCallback((value: string) => {
    const normalizedValue = value?.trim() ?? "";

    if (!normalizedValue) {
      return;
    }

    setAssignmentIdState(normalizedValue);

    try {
      localStorage.setItem(ASSIGNMENT_ID_STORAGE_KEY, normalizedValue);
      localStorage.removeItem(LEGACY_ASSIGNMENT_STORAGE_KEY);
      window.dispatchEvent(new Event(ASSIGNMENT_CHANGED_EVENT));
    } catch {
      // Silently handle storage error
    }
  }, []);

  const setClubId = useCallback((value: string) => {
    const normalizedValue = value?.trim() ?? "";

    if (!normalizedValue) {
      return;
    }

    setClubIdState(normalizedValue);

    try {
      localStorage.setItem(CLUB_ID_STORAGE_KEY, normalizedValue);
      window.dispatchEvent(new Event(CLUB_CHANGED_EVENT));
    } catch {
      // Silently handle storage error
    }
  }, []);

  return {
    assignmentId,
    setAssignmentId,
    clubId,
    setClubId,
  };
};
