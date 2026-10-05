export const tamaños = [
  { id: 'personal', nombre: 'Personal', detalle: '6 porciones', multiplicador: 0.8 },
  { id: 'mediano', nombre: 'Mediano', detalle: '10 porciones', multiplicador: 1.0 },
  { id: 'familiar', nombre: 'Familiar', detalle: '16 porciones', multiplicador: 1.3 },
]

export const tamañosFijos = [
  { id: 'individual', nombre: 'Individual', detalle: '1 porción', multiplicador: 1.0 },
  { id: 'unidad', nombre: 'Unidad', detalle: '1 unidad', multiplicador: 1.0 },
]

export function obtenerTamaño(tamañoId, personalizable) {
  const lista = personalizable ? tamaños : tamañosFijos
  return lista.find((t) => t.id === tamañoId) || lista[0]
}

export function calcularPrecioUnitario(precioBase, tamañoId, personalizable) {
  const tamaño = obtenerTamaño(tamañoId, personalizable)
  return Math.round(precioBase * tamaño.multiplicador)
}
