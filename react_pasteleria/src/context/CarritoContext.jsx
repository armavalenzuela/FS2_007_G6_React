import { createContext, useContext, useMemo, useState } from "react";
import { obtener } from "../data/baseDatos.js";

const CLAVE_CARRITO = "carritoMilSabores";
const CarritoContext = createContext(null);

function leerCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    return guardado.filter((i) => i && Number.isInteger(i.cantidad) && i.cantidad > 0);
  } catch (error) {
    return [];
  }
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarrito);

  function guardar(nuevos) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(nuevos));
    setItems(nuevos);
  }

  function agregar(codigo, cantidad = 1) {
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return { ok: false, mensaje: "Cantidad inválida" };
    }
    const producto = obtener("productos", codigo);
    if (!producto) return { ok: false, mensaje: "Producto no encontrado" };
    if (producto.stock <= 0) return { ok: false, mensaje: "Producto sin stock" };

    const actual = items.find((i) => i.codigo === codigo);
    const cantidadFinal = (actual ? actual.cantidad : 0) + cantidad;
    if (cantidadFinal > producto.stock) {
      return { ok: false, mensaje: `Solo quedan ${producto.stock} unidades de este producto` };
    }

    const nuevos = actual
      ? items.map((i) => (i.codigo === codigo ? { ...i, cantidad: cantidadFinal } : i))
      : [...items, { codigo, cantidad }];
    guardar(nuevos);
    return { ok: true, mensaje: "Producto agregado al carrito" };
  }

  function cambiarCantidad(codigo, cantidad) {
    if (!Number.isInteger(cantidad)) return;
    if (cantidad <= 0) return quitar(codigo);
    const producto = obtener("productos", codigo);
    const final = producto ? Math.min(cantidad, producto.stock) : cantidad;
    guardar(items.map((i) => (i.codigo === codigo ? { ...i, cantidad: final } : i)));
  }

  function quitar(codigo) {
    guardar(items.filter((i) => i.codigo !== codigo));
  }

  function vaciar() {
    guardar([]);
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
    [items]
  );

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return contexto;
}
