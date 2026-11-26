export function normalizarRol(tipo) {
  const rol = tipo?.trim().toLowerCase();
  return rol === "admin" ? "administrador" : rol;
}
