import { useSyncExternalStore } from "react";
import { suscribirse, obtenerEstado } from "../data/baseDatos.js";

export function useColeccion(nombreColeccion) {
  return useSyncExternalStore(suscribirse, () => obtenerEstado()[nombreColeccion] || []);
}
