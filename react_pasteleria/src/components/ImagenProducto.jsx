import { useState } from "react";

export default function ImagenProducto({ src, alt, categoria }) {
  const [noDisponible, setNoDisponible] = useState(false);

  if (noDisponible || !src) {
    return (
      <div className="d-flex align-items-center justify-content-center bg-light text-secondary w-100 h-100 p-3 text-center" role="img" aria-label={alt}>
        {categoria || "Imagen no disponible"}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="img-fluid w-100"
      onError={() => setNoDisponible(true)}
    />
  );
}
