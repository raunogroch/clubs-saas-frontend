import { useState } from "react";

export type AlertType = "success" | "info" | "warning" | "danger";

interface AlertProps {
  type: AlertType;
  message: string;
  dismissible?: boolean;
  timestamp?: Date;
  link?: {
    text: string;
    href: string;
  };
}

export const Alert = ({
  type,
  message,
  dismissible = true,
  timestamp,
  link,
}: AlertProps) => {
  const [isVisible, _] = useState(true);

  if (!isVisible) return null;

  const getTimeString = () => {
    if (!timestamp) return "";
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diff < 60) return "hace unos segundos";
    if (diff < 3600)
      return `hace ${Math.floor(diff / 60)} minuto${Math.floor(diff / 60) > 1 ? "s" : ""}`;
    if (diff < 86400)
      return `hace ${Math.floor(diff / 3600)} hora${Math.floor(diff / 3600) > 1 ? "s" : ""}`;
    return `hace ${Math.floor(diff / 86400)} día${Math.floor(diff / 86400) > 1 ? "s" : ""}`;
  };

  return (
    <div
      className={`alert alert-${type} ${dismissible ? "alert-dismissable" : ""}`}
    >
      <div className="alert-content">
        <span>{message}</span>
        {link && (
          <>
            {" "}
            <a className="alert-link" href={link.href}>
              {link.text}
            </a>
          </>
        )}
        {timestamp && (
          <div className="alert-time text-muted small">{getTimeString()}</div>
        )}
      </div>
    </div>
  );
};

export default Alert;
