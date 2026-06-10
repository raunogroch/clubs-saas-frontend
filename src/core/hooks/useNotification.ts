import toastr from "toastr";

export interface UseNotificationReturn {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

// Configuración global (una sola vez)
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 5000,
  extendedTimeOut: 1000,
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

export const useNotification = (): UseNotificationReturn => {
  const showToast = (
    type: "success" | "error" | "warning" | "info",
    message: string,
    duration = 5000,
  ) => {
    toastr[type](message, undefined, {
      timeOut: duration,
      extendedTimeOut: Math.floor(duration / 5),
    });
  };

  return {
    success: (message, duration) => showToast("success", message, duration),

    error: (message, duration) => showToast("error", message, duration),

    warning: (message, duration) => showToast("warning", message, duration),

    info: (message, duration) => showToast("info", message, duration),
  };
};
