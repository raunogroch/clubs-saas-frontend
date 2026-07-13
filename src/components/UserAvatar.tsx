import { useEffect, useMemo, useRef, useState } from "react";
import { Cropper, type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.min.css";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { updateUser as updateAuthUser } from "../features/auth";
import {
  useLazyGetUserByIdQuery,
  useUploadProfileImageMutation,
} from "../features/users/userApi";
import { Modal } from "./Modal";

interface UserAvatarProps {
  imageUrl?: string | null;
  name?: string;
  size?: number;
  userId?: string | null;
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

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
        return;
      }

      reject(new Error("No se pudo leer la imagen."));
    };

    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
};

export const UserAvatar = ({
  imageUrl,
  name = "Usuario",
  size = 40,
  userId,
}: UserAvatarProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageCacheVersion, setImageCacheVersion] = useState(() => Date.now());
  const cropperRef = useRef<ReactCropperElement>(null);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [uploadProfileImage] = useUploadProfileImageMutation();
  const [triggerGetUserById] = useLazyGetUserByIdQuery();
  const resolvedImageUrl = useMemo(
    () => resolveProfileImageUrl(imageUrl),
    [imageUrl],
  );
  const shouldShowPlaceholder = useMemo(
    () => !resolvedImageUrl || hasImageError,
    [resolvedImageUrl, hasImageError],
  );
  const displayImageUrl = useMemo(() => {
    if (!resolvedImageUrl) return null;

    const separator = resolvedImageUrl.includes("?") ? "&" : "?";
    return `${resolvedImageUrl}${separator}t=${imageCacheVersion}`;
  }, [resolvedImageUrl, imageCacheVersion]);

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedImage(null);
      setPreviewUrl(null);
    }
  }, [isModalOpen]);

  const resetModalState = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await readFileAsDataUrl(file);
      setSelectedImage(result);
      setPreviewUrl(result);
    } catch (error) {
      console.error("Error al leer la imagen:", error);
    }
  };

  const updatePreviewFromCropper = () => {
    const cropper = cropperRef.current?.cropper;

    if (!cropper) return;

    if (!cropper.getImageData().naturalWidth) return;

    const canvas = cropper.getCroppedCanvas({
      width: 180,
      height: 180,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (!canvas) return;

    setPreviewUrl(canvas.toDataURL("image/jpeg", 0.9));
  };

  const handleCropSave = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper || !userId) return;

    const canvas = cropper.getCroppedCanvas({
      width: 180,
      height: 180,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (!canvas) return;

    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setIsSaving(true);

    try {
      const updatedUser = await uploadProfileImage({
        id: userId,
        base64Data: croppedDataUrl,
        type: "PROFILE_IMAGE",
      }).unwrap();

      const shouldUpdateAuthState = currentUser?.id === updatedUser.id;
      if (shouldUpdateAuthState) {
        dispatch(updateAuthUser(updatedUser));
      }

      const refreshedUser = await triggerGetUserById(userId).unwrap();

      if (shouldUpdateAuthState && currentUser?.id === refreshedUser.id) {
        dispatch(updateAuthUser(refreshedUser));
      }

      setPreviewUrl(croppedDataUrl);
      setSelectedImage(croppedDataUrl);
      setImageCacheVersion(Date.now());
      setHasImageError(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al guardar foto:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
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
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => setIsModalOpen(true)}
      >
        {shouldShowPlaceholder ? (
          <i className="fa fa-camera" aria-hidden="true" />
        ) : (
          <img
            key={displayImageUrl ?? `avatar-${userId ?? "default"}`}
            src={displayImageUrl ?? undefined}
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
            opacity: isHovering ? 1 : 0,
            transition: "opacity 0.2s ease-in-out",
            pointerEvents: "none",
          }}
        >
          <i className="fa fa-edit text-white fs-5" aria-hidden="true" />
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Actualizar foto de perfil"
        description="Sube una imagen y recórtala antes de guardarla."
        size="lg"
      >
        <div className="py-2">
          {!selectedImage ? (
            <div className="text-center">
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
              <small className="text-muted d-block mt-2">
                Selecciona una imagen para comenzar el recorte.
              </small>
            </div>
          ) : (
            <div className="row g-3 align-items-start">
              <div className="col-md-4">
                <div className="text-center">
                  <div
                    className="border rounded overflow-hidden mx-auto"
                    style={{ width: 180, height: 180 }}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Previsualización del recorte"
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                        Sin previsualización
                      </div>
                    )}
                  </div>
                  <small className="text-muted d-block mt-2">
                    Previsualización del lado izquierdo
                  </small>
                </div>
              </div>

              <div className="col-md-8">
                <div
                  className="border rounded p-2"
                  style={{
                    backgroundColor: "#f8f9fa",
                    minHeight: 360,
                    overflow: "hidden",
                  }}
                >
                  <Cropper
                    ref={cropperRef}
                    src={selectedImage}
                    style={{ height: 360, width: "100%" }}
                    aspectRatio={1}
                    viewMode={1}
                    guides
                    autoCropArea={1}
                    crop={updatePreviewFromCropper}
                    zoom={updatePreviewFromCropper}
                    cropmove={updatePreviewFromCropper}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    className="btn btn-secondary"
                    onClick={resetModalState}
                    disabled={isSaving}
                  >
                    Volver a elegir
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => void handleCropSave()}
                    disabled={isSaving}
                    aria-busy={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="me-2 spinner-border spinner-border-sm" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar foto"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
