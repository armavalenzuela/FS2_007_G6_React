import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { carritoService } from "../services/carritoService.js";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const { usuario: usuarioAuth } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    let activo = true;
    async function cargar() {
      if (!usuarioAuth?.correo) {
        setItems([]);
        return;
      }
      try {
        const data = await carritoService.get();
        if (!activo) return;
        const guardados = typeof data === "string" ? JSON.parse(data) : data;
        if (Array.isArray(guardados)) {
          setItems(guardados.filter((i) => i && typeof i.codigo === "string" && Number.isInteger(i.cantidad) && i.cantidad > 0));
        }
      } catch (e) {
      }
    }
    cargar();
    return () => { activo = false; };
  }, [usuarioAuth?.correo]);

  function guardar(nuevos) {
    setItems(nuevos);
    if (usuarioAuth?.correo) {
      carritoService.save(nuevos).catch(() => {});
    }
  }

  function agregar(codigo, cantidad = 1) {
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return { ok: false, mensaje: "Cantidad inválida" };
    }
    const actual = items.find((i) => i.codigo === codigo);
    const cantidadFinal = (actual ? actual.cantidad : 0) + cantidad;
    const nuevos = actual
      ? items.map((i) => (i.codigo === codigo ? { ...i, cantidad: cantidadFinal } : i))
      : [...items, { codigo, cantidad }];
    guardar(nuevos);
    return { ok: true, mensaje: "Producto agregado al carrito" };
  }

  function cambiarCantidad(codigo, cantidad) {
    if (!Number.isInteger(cantidad)) return;
    if (cantidad <= 0) return quitar(codigo);
    guardar(items.map((i) => (i.codigo === codigo ? { ...i, cantidad } : i)));
  }

  function quitar(codigo) {
    guardar(items.filter((i) => i.codigo !== codigo));
  }

  function vaciar() {
    guardar([]);
    if (usuarioAuth?.correo) carritoService.clear().catch(() => {});
  }

  const valor = useMemo(
    () => ({
      items,
      cantidadTotal: items.reduce((suma, i) => suma + i.cantidad, 0),
      agregar,
      cambiarCantidad,
      quitar,
      vaciar,
    }),
    [items, usuarioAuth?.correo]
  );

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return contexto;
}
