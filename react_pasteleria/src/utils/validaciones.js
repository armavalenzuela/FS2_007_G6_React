import { correoPermitido, contrasenaValida, LARGO_CONTRASENA } from "../data/reglasNegocio.js";

export function nombreValido(nombre) {
  const texto = (nombre || "").trim();
  return texto.length > 0 && texto.length <= 100 && !/[0-9]/.test(texto);
}

export function nombreCompletoValido(nombre) {
  return (nombre || "").trim().length >= 3;
}

export function comentarioValido(comentario) {
  const texto = (comentario || "").trim();
  return texto.length > 0 && texto.length <= 500;
}

function fechaLocal(hoy) {
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export function fechaNoFutura(fecha, hoy = new Date()) {
  if (!fecha) return false;
  return fecha <= fechaLocal(hoy);
}

export function fechaFutura(fecha, hoy = new Date()) {
  if (!fecha) return false;
  return fecha >= fechaLocal(hoy);
}

export function validarLogin({ correo, contrasena }) {
  const errores = {};
  if (!correoPermitido(correo)) {
    errores.correo = "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com)";
  }
  if (!contrasenaValida(contrasena)) {
    errores.contrasena = `La contraseña debe tener entre 8 y 10 caracteres.`;
  }
  return errores;
}

export function validarRegistro({ nombre, correo, fechaNacimiento, contrasena, confirmacion, terminos }, existeCorreo) {
  const errores = {};
  if (!nombreCompletoValido(nombre)) errores.nombre = "Ingresa tu nombre completo (mínimo 3 caracteres).";
  if (!correoPermitido(correo)) errores.correo = "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  else if (existeCorreo(correo)) errores.correo = "Ya existe una cuenta con este correo.";
  if (!fechaNoFutura(fechaNacimiento)) errores.fechaNacimiento = "Ingresa una fecha de nacimiento válida.";
  if (!contrasenaValida(contrasena)) {
    errores.contrasena = `La contraseña debe tener entre ${LARGO_CONTRASENA.minimo} y ${LARGO_CONTRASENA.maximo} caracteres.`;
  }
  if (confirmacion !== contrasena) errores.confirmacion = "Las contraseñas no coinciden.";
  if (!terminos) errores.terminos = "Debes aceptar los términos para continuar.";
  return errores;
}

export function validarDireccion(datos) {
  const errores = {};
  if (!nombreCompletoValido(datos.nombre)) errores.nombre = "Ingresa tu nombre.";
  if (!datos.apellidos || !datos.apellidos.trim()) errores.apellidos = "Ingresa tus apellidos.";
  if (!/^\S+@\S+\.\S+$/.test((datos.correo || "").trim())) errores.correo = "Ingresa un correo válido.";
  if (!datos.calle || !datos.calle.trim()) errores.calle = "Ingresa la calle y número.";
  if (!datos.region) errores.region = "Selecciona una región.";
  if (!datos.comuna) errores.comuna = "Selecciona una comuna.";
  if (!fechaFutura(datos.fechaEntrega)) errores.fechaEntrega = "Ingresa una fecha de entrega válida (hoy o posterior).";
  return errores;
}
