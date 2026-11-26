export function generarNumeroPedido(ahora = Date.now()) {
  return "MS-" + String(ahora).slice(-8) + Math.floor(Math.random() * 90 + 10);
}
