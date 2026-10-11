// Registra un pedido pagado, crea la boleta y descuenta el stock de cada producto.
import { crear, obtener, actualizar } from "../data/baseDatos.js";
import { calcularTotales } from "../data/reglasNegocio.js";

export function generarNumeroPedido(ahora = Date.now()) {
  return "MS-" + String(ahora).slice(-8) + Math.floor(Math.random() * 90 + 10);
}

export function registrarPedido({ items, datosEnvio, usuario, metodoPago, codigoAutorizacion }) {
  const productos = items
    .map((item) => obtener("productos", item.codigo))
    .filter(Boolean);
  const resumen = calcularTotales(items, productos, usuario);

  const pedido = crear("pedidos", {
    numero: generarNumeroPedido(),
    fecha: new Date().toISOString(),
    usuarioCorreo: usuario ? usuario.correo : null,
    envio: datosEnvio,
    metodoPago,
    codigoAutorizacion,
    lineas: resumen.lineas,
    subtotal: resumen.subtotal,
    descuentoTortaDuoc: resumen.descuentoTortaDuoc,
    descuentoEdad: resumen.descuentoEdad,
    descuentoCodigo: resumen.descuentoCodigo,
    total: resumen.total,
    estado: "pagado",
  });

  // Descuento de stock por cada línea vendida
  resumen.lineas.forEach((linea) => {
    const producto = obtener("productos", linea.codigo);
    if (producto) {
      actualizar("productos", linea.codigo, { stock: Math.max(0, producto.stock - linea.cantidad) });
    }
  });

  return pedido;
}
