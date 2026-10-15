import { crear, obtener, actualizar } from "../data/baseDatos.js";
import { validarStock } from "../data/reglasNegocio.js";

export function generarNumeroPedido(ahora = Date.now()) {
  return "MS-" + String(ahora).slice(-8) + Math.floor(Math.random() * 90 + 10);
}

export function registrarPedido({ items, resumen, datosEnvio, usuario, metodoPago, codigoAutorizacion }) {
  const productos = items.map((item) => obtener("productos", item.codigo)).filter(Boolean);
  const problemas = validarStock(items, productos);
  if (problemas.length > 0) {
    throw new Error(`${problemas[0].motivo}. Actualiza tu carrito para continuar.`);
  }

  let numero = generarNumeroPedido();
  for (let intento = 0; intento < 5 && obtener("pedidos", numero); intento++) {
    numero = generarNumeroPedido();
  }

  const pedido = crear("pedidos", {
    numero,
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

  resumen.lineas.forEach((linea) => {
    const producto = obtener("productos", linea.codigo);
    if (producto) {
      actualizar("productos", linea.codigo, { stock: Math.max(0, producto.stock - linea.cantidad) });
    }
  });

  return pedido;
}
