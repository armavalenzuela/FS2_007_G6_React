export function leerStorage(clave, valorPorDefecto = null) {
  try {
    const crudo = localStorage.getItem(clave)
    if (crudo === null) return valorPorDefecto
    return JSON.parse(crudo)
  } catch {
    return valorPorDefecto
  }
}

export function escribirStorage(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {}
}

export function eliminarStorage(clave) {
  try {
    localStorage.removeItem(clave)
  } catch {}
}

export function leerSession(clave, valorPorDefecto = null) {
  try {
    const crudo = sessionStorage.getItem(clave)
    if (crudo === null) return valorPorDefecto
    return JSON.parse(crudo)
  } catch {
    return valorPorDefecto
  }
}

export function escribirSession(clave, valor) {
  try {
    sessionStorage.setItem(clave, JSON.stringify(valor))
  } catch {}
}

export function eliminarSession(clave) {
  try {
    sessionStorage.removeItem(clave)
  } catch {}
}
