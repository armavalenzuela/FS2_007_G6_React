import { Navigate } from "react-router-dom";
import { useSesion } from "../../context/SesionContext.jsx";

// Protege una ruta: exige inicio de sesión y que el tipo de usuario esté permitido 
export default function ProtectedRoute({ roles, children }) {
  const { usuario } = useSesion();
  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.tipo)) return <Navigate to="/" replace />;
  return children;
}
