import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { carritoService } from "../services/carritoService.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const RESUMEN_VACIO = { lineas: [], subtotal: 0, total: 0 };

export function useResumenCarrito(items) {
  const { usuario } = useAuth();
  const correo = usuario?.correo;
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    if (items.length === 0) return;
    let activo = true;
    carritoService.resumen(items)
      .then((resumen) => {
        if (activo) setResultado({ items, correo, resumen, error: "" });
      })
      .catch((err) => {
        if (activo) setResultado({ items, correo, resumen: null, error: getErrorMessage(err) });
      });
    return () => { activo = false; };
  }, [items, correo]);

  if (items.length === 0) return { resumen: RESUMEN_VACIO, error: "", cargando: false };
  if (resultado?.items !== items || resultado?.correo !== correo) {
    return { resumen: null, error: "", cargando: true };
  }
  return { resumen: resultado.resumen, error: resultado.error, cargando: false };
}
