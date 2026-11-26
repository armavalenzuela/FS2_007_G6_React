import { Navigate, useLocation } from "react-router-dom";
import { normalizarRol } from "../utils/roles.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ roles, children }) {
  const { usuario: usuarioAuth } = useAuth();
  const ubicacion = useLocation();
  const rol = normalizarRol(usuarioAuth?.rol);
  if (!rol) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />;
  }
  if (roles && !roles.includes(rol)) return <Navigate to="/" replace />;
  return children;
}
