export function generarNumeroPedido(ahora = Date.now()) {
  return "MS-" + String(ahora).slice(-8) + Math.floor(Math.random() * 90 + 10);
}

export function registrarPedido({ items, resumen, datosEnvio, usuario, metodoPago, codigoAutorizacion }) {
  const numero = generarNumeroPedido();

  const pedido = {
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
  };

  return pedido;
}
