import { precioUnitario } from "../data/reglasNegocio.js";

export function filtrarProductos(productos, { texto = "", categoria = "", tipo = "", orden = "" } = {}) {
  const busqueda = texto.trim().toLowerCase();
  const resultado = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda) &&
    (categoria === "" || p.categoria === categoria) &&
    (tipo === "" || p.tipo === tipo)
  );
  if (orden === "asc") resultado.sort((a, b) => precioUnitario(a) - precioUnitario(b));
  if (orden === "desc") resultado.sort((a, b) => precioUnitario(b) - precioUnitario(a));
  return resultado;
}

export function categoriasUnicas(productos) {
  return [...new Set(productos.map((p) => p.categoria))];
}
