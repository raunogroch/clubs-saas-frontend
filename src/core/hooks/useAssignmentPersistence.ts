import { useCallback, useState } from "react";

const ASSIGNMENT_ID_STORAGE_KEY = "activeAssignmentId";
const LEGACY_ASSIGNMENT_STORAGE_KEY = "activeAssignment";

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

  const [assignmentId, setAssignmentIdState] = useState<string>(
    getStoredAssignmentId,
  );

  const setAssignmentId = useCallback((value: string) => {
    const normalizedValue = value?.trim() ?? "";

    if (!normalizedValue) {
      return;
    }

    setAssignmentIdState(normalizedValue);

    try {
      localStorage.setItem(ASSIGNMENT_ID_STORAGE_KEY, normalizedValue);
      localStorage.removeItem(LEGACY_ASSIGNMENT_STORAGE_KEY);
    } catch {
      // Silently handle storage error
    }
  }, []);

  return {
    assignmentId,
    setAssignmentId,
  };
};
