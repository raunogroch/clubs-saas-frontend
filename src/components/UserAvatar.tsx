import { useState } from "react";

interface UserAvatarProps {
  imageUrl?: string | null;
  name?: string;
  size?: number;
}

const resolveProfileImageUrl = (imageUrl?: string | null) => {
  const rawValue = imageUrl?.trim();
  if (!rawValue) return null;

  const markdownMatch = rawValue.match(/\((https?:\/\/[^)]+)\)/i);
  const cleanedValue = (markdownMatch ? markdownMatch[1] : rawValue)
    .replace(/^\[|\]$/g, "")
    .trim();

  if (!cleanedValue) return null;
  if (cleanedValue.includes("_small")) return cleanedValue;
  if (cleanedValue.includes("_large")) {
    return cleanedValue.replace(/_large/gi, "_small");
  }

  const lastDotIndex = cleanedValue.lastIndexOf(".");
  if (lastDotIndex === -1) return cleanedValue;

  return `${cleanedValue.slice(0, lastDotIndex)}_small${cleanedValue.slice(lastDotIndex)}`;
};

export const UserAvatar = ({
  imageUrl,
  name = "Usuario",
  size = 40,
}: UserAvatarProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const resolvedImageUrl = resolveProfileImageUrl(imageUrl);
  const shouldShowPlaceholder = !resolvedImageUrl || hasImageError;

  const handleOverlay = (
    event: React.MouseEvent<HTMLDivElement>,
    visible: boolean,
  ) => {
    const overlay = event.currentTarget.lastElementChild as HTMLElement | null;
    if (overlay) overlay.style.opacity = visible ? "1" : "0";
  };

  return (
    <div
      className="position-relative d-flex align-items-center justify-content-center rounded-circle border bg-light text-muted"
      style={{
        width: size,
        height: size,
        overflow: "hidden",
        cursor: "pointer",
      }}
      title={name}
      aria-label={`Foto de perfil de ${name}`}
      onMouseEnter={(event) => handleOverlay(event, true)}
      onMouseLeave={(event) => handleOverlay(event, false)}
    >
      {shouldShowPlaceholder ? (
        <i className="fa fa-camera" aria-hidden="true" />
      ) : (
        <img
          src={resolvedImageUrl}
          alt={`Foto de perfil de ${name}`}
          className="img-fluid w-100 h-100"
          style={{ objectFit: "cover" }}
          onError={() => setHasImageError(true)}
        />
      )}

      <div
        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-circle"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          opacity: 0,
          transition: "opacity 0.2s ease-in-out",
          pointerEvents: "none",
        }}
      >
        <i className="fa fa-edit text-white fs-5" aria-hidden="true" />
      </div>
    </div>
  );
};
