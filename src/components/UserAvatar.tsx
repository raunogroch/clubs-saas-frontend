import { useEffect, useRef, useState } from "react";
import { Cropper, type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.min.css";
import { Modal } from "./Modal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cropperRef = useRef<ReactCropperElement>(null);
  const resolvedImageUrl = resolveProfileImageUrl(imageUrl);
  const shouldShowPlaceholder = !resolvedImageUrl || hasImageError;

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedImage(null);
      setPreviewUrl(null);
    }
  }, [isModalOpen]);

  const handleOverlay = (
    event: React.MouseEvent<HTMLDivElement>,
    visible: boolean,
  ) => {
    const overlay = event.currentTarget.lastElementChild as HTMLElement | null;
    if (overlay) overlay.style.opacity = visible ? "1" : "0";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedImage(result);
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
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

  const handleCropSave = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
    console.log("Base64 image:", croppedDataUrl);
    setPreviewUrl(croppedDataUrl);
    setSelectedImage(croppedDataUrl);
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
        onMouseEnter={(event) => handleOverlay(event, true)}
        onMouseLeave={(event) => handleOverlay(event, false)}
        onClick={() => setIsModalOpen(true)}
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
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Volver a elegir
                  </button>
                  <button className="btn btn-primary" onClick={handleCropSave}>
                    Guardar foto
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
