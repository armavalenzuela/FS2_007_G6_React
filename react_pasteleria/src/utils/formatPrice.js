export function formatPrice(valor) {
  if (typeof valor !== 'number' || Number.isNaN(valor)) return '$0'
  return `$${valor.toLocaleString('es-CL')}`
}
