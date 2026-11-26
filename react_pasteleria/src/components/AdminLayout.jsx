import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { normalizarRol } from "../utils/roles.js";

const MENU = [
    { ruta: "/admin", texto: "Inicio", fin: true, soloAdmin: true },
    { ruta: "/admin/productos", texto: "Productos" },
    { ruta: "/admin/usuarios", texto: "Usuarios", soloAdmin: true },
    { ruta: "/admin/contactos", texto: "Contactos", soloAdmin: true },
    { ruta: "/admin/pedidos", texto: "Órdenes / boletas", soloAdmin: true },
];

export default function AdminLayout() {
    return (
        <ProtectedRoute roles={["administrador", "vendedor"]}>
            <Shell />
        </ProtectedRoute>
    );
}

function Shell() {
    const { usuario: usuarioAuth, logout: logoutAuth } = useAuth();
    const navegar = useNavigate();
    const esAdmin = normalizarRol(usuarioAuth?.rol) === "administrador";

    function salir() {
        logoutAuth();
        navegar("/login");
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <Link to="/admin" className="admin-marca">Mil Sabores Administración</Link>
                {MENU.filter((item) => esAdmin || !item.soloAdmin).map((item) => (
                    <NavLink key={item.ruta} to={item.ruta} end={item.fin}>{item.texto}</NavLink>
                ))}
                <hr style={{ borderColor: "rgba(255,255,255,.2)" }} />
                <Link to="/">Volver a la tienda</Link>
                <button className="btn btn-danger w-100 mt-3" onClick={salir}>Cerrar sesión</button>
            </aside>
            <main className="admin-contenido">
                <Outlet />
            </main>
        </div>
    );
}