export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return 0
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  if (Number.isNaN(nac.getTime())) return 0
  let edad = hoy.getFullYear() - nac.getFullYear()
  const mes = hoy.getMonth() - nac.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--
  return edad
}

export function esCorreoDuoc(email) {
  return typeof email === 'string' && email.toLowerCase().endsWith('@duoc.cl')
}

export function esCumpleanosHoy(fechaNacimiento) {
  if (!fechaNacimiento) return false
  const hoy = new Date()
  const nac = new Date(fechaNacimiento)
  if (Number.isNaN(nac.getTime())) return false
  return hoy.getMonth() === nac.getMonth() && hoy.getDate() === nac.getDate()
}

export function esMayorDe50(usuario) {
  return calcularEdad(usuario?.fechaNacimiento) >= 50
}

export function obtenerDescuentosUsuario(usuario) {
  const motivos = []
  if (!usuario) return { mejorPorcentaje: 0, motivos, tieneTortaGratisDuoc: false }

  let mejorPorcentaje = 0
  const edad = calcularEdad(usuario.fechaNacimiento)

  if (edad >= 50) {
    motivos.push('Descuento 50% por ser mayor de 50 años')
    mejorPorcentaje = Math.max(mejorPorcentaje, 0.5)
  }

  if (usuario.codigoDescuento === 'FELICES50') {
    motivos.push('Descuento 10% de por vida con código FELICES50')
    mejorPorcentaje = Math.max(mejorPorcentaje, 0.1)
  }

  const tieneTortaGratisDuoc =
    esCorreoDuoc(usuario.email) && esCumpleanosHoy(usuario.fechaNacimiento)

  if (tieneTortaGratisDuoc) {
    motivos.push('¡Feliz cumpleaños! Tu torta de estudiante Duoc es gratis!')
  }

  return { mejorPorcentaje, motivos, tieneTortaGratisDuoc }
}

export function aplicarDescuento(subtotal, porcentaje) {
  if (!subtotal || !porcentaje) return subtotal
  return Math.round(subtotal * (1 - porcentaje))
}

export function aplicarTortaGratisDuoc(items, esElegible) {
  if (!esElegible || !items || items.length === 0) {
    return { itemsDescuentados: items || [], montoGratuito: 0 }
  }

  let indiceGratis = -1
  for (let i = 0; i < items.length; i++) {
    if (
      items[i].mensaje ||
      items[i].tamaño === 'Personal' ||
      items[i].tamaño === 'Mediano' ||
      items[i].tamaño === 'Familiar'
    ) {
      indiceGratis = i
      break
    }
  }
  if (indiceGratis === -1) indiceGratis = 0

  const itemsDescuentados = items.map((item, i) => {
    if (i !== indiceGratis) return item
    return {
      ...item,
      precioUnitario: 0,
      subtotal: 0,
      esGratisDuoc: true,
    }
  })

  return {
    itemsDescuentados,
    montoGratuito: items[indiceGratis].subtotal,
  }
}

export function calcularTotalesPedido(items, usuario) {
  const subtotal = (items || []).reduce((acc, item) => acc + item.subtotal, 0)
  const { mejorPorcentaje, motivos, tieneTortaGratisDuoc } = obtenerDescuentosUsuario(usuario)

  const { itemsDescuentados, montoGratuito } = aplicarTortaGratisDuoc(items, tieneTortaGratisDuoc)
  const subtotalConGratis = itemsDescuentados.reduce((acc, item) => acc + item.subtotal, 0)

  const descuentoPorcentaje = aplicarDescuento(subtotalConGratis, mejorPorcentaje)
  const total = subtotalConGratis - descuentoPorcentaje

  return {
    subtotal,
    subtotalConTortaGratis: subtotalConGratis,
    montoGratuito,
    descuentoPorcentaje: mejorPorcentaje,
    montoDescuento: subtotalConGratis - descuentoPorcentaje,
    total,
    motivos,
    itemsFinales: itemsDescuentados,
  }
}
