import { Navigate } from "react-router-dom";
import { useSesion } from "../../context/SesionContext.jsx";

export default function ProtectedRoute({ roles, children }) {
  const { usuario } = useSesion();
  const ubicacion = useLocation();
  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />;
  }
  if (roles && !roles.includes(usuario.tipo)) return <Navigate to="/" replace />;
  return children;
}
