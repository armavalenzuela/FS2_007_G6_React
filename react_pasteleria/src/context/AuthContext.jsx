import { createContext, useContext, useEffect, useState } from 'react'
import { leerStorage, escribirStorage, leerSession, escribirSession, eliminarSession } from '../utils/storage'
import { esCorreoDuoc } from '../utils/descuentos'

const claveUsuarios = 'pasteleria_usuarios'
const claveSesion = 'pasteleria_sesion'

const AuthContext = createContext(null)

function generarId() {
  return `USR-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState(() => leerStorage(claveUsuarios, []))
  const [usuarioActual, setUsuarioActual] = useState(() => leerSession(claveSesion, null))

  useEffect(() => {
    escribirStorage(claveUsuarios, usuarios)
  }, [usuarios])

  useEffect(() => {
    if (usuarioActual) {
      escribirSession(claveSesion, usuarioActual)
    } else {
      eliminarSession(claveSesion)
    }
  }, [usuarioActual])

  function registrar({ nombre, email, password, fechaNacimiento, codigoDescuento }) {
    const emailLimpio = (email || '').trim().toLowerCase()
    const existe = usuarios.some((u) => u.email === emailLimpio)
    if (existe) return { ok: false, error: 'Ya existe una cuenta con este correo.' }

    if (!nombre || !emailLimpio || !password || !fechaNacimiento) {
      return { ok: false, error: 'Completa todos los campos obligatorios.' }
    }

    if (password.length < 4 || password.length > 10) {
      return { ok: false, error: 'La contraseña debe tener entre 4 y 10 caracteres.' }
    }

    const codigo = (codigoDescuento || '').trim().toUpperCase()
    const nuevoUsuario = {
      id: generarId(),
      nombre: nombre.trim(),
      email: emailLimpio,
      password,
      fechaNacimiento,
      codigoDescuento: codigo === 'FELICES50' ? 'FELICES50' : null,
      esEstudianteDuoc: esCorreoDuoc(emailLimpio),
      preferencias: {
        categoriaFavorita: '',
        recibirPromociones: true,
        tipoEntrega: 'delivery',
      },
      fechaRegistro: new Date().toISOString(),
    }

    setUsuarios((prev) => [...prev, nuevoUsuario])
    setUsuarioActual(nuevoUsuario)
    return { ok: true, usuario: nuevoUsuario }
  }

  function iniciarSesion(email, password) {
  const emailLimpio = (email || '').trim().toLowerCase()
  const usuario = usuarios.find((u) => u.email === emailLimpio && u.password === password)
  if (!usuario) return { ok: false, error: 'Correo o contraseña incorrectos.' }
  setUsuarioActual(usuario)
  return { ok: true, usuario }
  }

  function cerrarSesion() {
    setUsuarioActual(null)
  }

  function actualizarPerfil(datos) {
    if (!usuarioActual) return { ok: false, error: 'Debes iniciar sesión.' }

    const actualizado = {
      ...usuarioActual,
      ...datos,
      email: (datos.email || usuarioActual.email).trim().toLowerCase(),
      esEstudianteDuoc: esCorreoDuoc(datos.email || usuarioActual.email),
    }

    setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)))
    setUsuarioActual(actualizado)
    return { ok: true, usuario: actualizado }
  }

  function actualizarPreferencias(preferencias) {
    if (!usuarioActual) return { ok: false, error: 'Debes iniciar sesión.' }

    const actualizado = {
      ...usuarioActual,
      preferencias: { ...usuarioActual.preferencias, ...preferencias },
    }

    setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)))
    setUsuarioActual(actualizado)
    return { ok: true, usuario: actualizado }
  }

  const value = {
    usuarioActual,
    usuarios,
    registrar,
    iniciarSesion,
    cerrarSesion,
    actualizarPerfil,
    actualizarPreferencias,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return contexto
}
