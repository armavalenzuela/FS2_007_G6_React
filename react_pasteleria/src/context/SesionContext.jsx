import { createContext, useContext, useMemo, useState } from "react";
import { obtener, actualizar, crear } from "../data/baseDatos.js";
import { useColeccion } from "../hooks/useColeccion.js";

const CLAVE_CORREO = "usuarioCorreo";
const SesionContext = createContext(null);

function sinContrasena(usuario) {
  if (!usuario) return null;
  const { contrasena, ...publico } = usuario;
  return publico;
}

export function SesionProvider({ children }) {
  const usuarios = useColeccion("usuarios");
  const [correoSesion, setCorreoSesion] = useState(() => localStorage.getItem(CLAVE_CORREO));

  const usuario = useMemo(() => {
    if (!correoSesion) return null;
    return sinContrasena(usuarios.find((u) => u.correo === correoSesion) || null);
  }, [usuarios, correoSesion]);

  function iniciarSesion(correo) {
    localStorage.setItem(CLAVE_CORREO, correo);
    setCorreoSesion(correo);
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_CORREO);
    setCorreoSesion(null);
  }

  function login(correo, contrasena) {
    const encontrado = obtener("usuarios", correo.trim().toLowerCase());
    if (!encontrado || encontrado.contrasena !== contrasena) return null;
    iniciarSesion(encontrado.correo);
    return sinContrasena(encontrado);
  }

  function registrar(datos) {
    const nuevo = crear("usuarios", {
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim().toLowerCase(),
      contrasena: datos.contrasena,
      tipo: "cliente",
      fechaNacimiento: datos.fechaNacimiento,
      telefono: "",
      codigoFelices50Aplicado: Boolean(datos.codigoFelices50Aplicado),
    });
    iniciarSesion(nuevo.correo);
    return sinContrasena(nuevo);
  }

  function actualizarPerfil(correo, cambios) {
    actualizar("usuarios", correo, cambios);
  }

  const valor = useMemo(
    () => ({ usuario, login, cerrarSesion, registrar, actualizarPerfil }),
    [usuario]
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const contexto = useContext(SesionContext);
  if (!contexto) throw new Error("useSesion debe usarse dentro de SesionProvider");
  return contexto;
}
