import { Navigate, useLocation } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function normalizarRol(usuarioAuth, usuarioSesion) {
  if (usuarioAuth?.rol) {
    const rol = usuarioAuth.rol.toLowerCase();
    if (rol === "admin") return "administrador";
    if (rol === "vendedor") return "vendedor";
    if (rol === "cliente") return "cliente";
    return rol;
  }
  return usuarioSesion?.tipo || null;
}

export default function ProtectedRoute({ roles, children }) {
  const { usuario: usuarioAuth } = useAuth();
  const { usuario: usuarioSesion } = useSesion();
  const ubicacion = useLocation();
  const rol = normalizarRol(usuarioAuth, usuarioSesion);
  if (!rol) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />;
  }
  if (roles && !roles.includes(rol)) return <Navigate to="/" replace />;
  return children;
}
