import { useCallback, useEffect, useState } from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertState {
  isVisible: boolean;
  message: string;
  type: AlertType;
}

export const useAlert = (autoDismissMs = 5000) => {
  const [alert, setAlert] = useState<AlertState>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showAlert = useCallback(
    (message: string, type: AlertType = "success") => {
      setAlert({
        isVisible: true,
        message,
        type,
      });
    },
    [],
  );

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  useEffect(() => {
    if (!alert.isVisible || autoDismissMs === 0) return;

    const timer = setTimeout(hideAlert, autoDismissMs);
    return () => clearTimeout(timer);
  }, [alert.isVisible, autoDismissMs, hideAlert]);

  return {
    isVisible: alert.isVisible,
    message: alert.message,
    type: alert.type,
    showAlert,
    hideAlert,
  };
};
