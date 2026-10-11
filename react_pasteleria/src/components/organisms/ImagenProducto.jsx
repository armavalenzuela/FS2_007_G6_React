import { useState } from "react";

// Muestra la foto del producto, si el archivo no existe, muestra un fondo rosado de respaldo
export default function ImagenProducto({ src, alt, categoria, className = "" }) {
  const [fallo, setFallo] = useState(false);
  const ruta = src && src.startsWith("assets/") ? "/" + src : src;
  if (fallo || !ruta) {
    return (
      <div className={`d-flex align-items-center justify-content-center h-100 w-100 text-center p-3 small ${className}`}>
        {categoria}
      </div>
    );
  }
  return (
    <img src={ruta} alt={alt} className={`w-100 h-100 ${className}`} style={{ objectFit: "cover" }}
      onError={() => setFallo(true)} />
  );
}
