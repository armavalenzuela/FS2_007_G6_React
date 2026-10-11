import { useSyncExternalStore } from "react";
import { suscribirse, obtenerEstado } from "../data/baseDatos.js";

// Devuelve una colección completa y se vuelve a renderizar cuando cambia en la base de datos
export function useColeccion(nombreColeccion) {
  return useSyncExternalStore(suscribirse, () => obtenerEstado()[nombreColeccion] || []);
}
