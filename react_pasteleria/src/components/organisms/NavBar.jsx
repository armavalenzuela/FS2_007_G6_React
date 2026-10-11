import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSesion } from "../../context/SesionContext.jsx";
import { useCarrito } from "../../context/CarritoContext.jsx";

const ENLACES = [
  { ruta: "/", texto: "Inicio", fin: true },
  { ruta: "/catalogo", texto: "Catálogo" },
  { ruta: "/ofertas", texto: "Ofertas" },
  { ruta: "/nosotros", texto: "Nosotros" },
  { ruta: "/blog", texto: "Blog" },
  { ruta: "/contacto", texto: "Contacto" },
];

export default function Navbar() {
  const { usuario, cerrarSesion } = useSesion();
  const { cantidadTotal } = useCarrito();
  const navegar = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  function salir() {
    cerrarSesion();
    navegar("/login");
  }

  const esAdmin = usuario && (usuario.tipo === "administrador" || usuario.tipo === "vendedor");

  return (
    <nav className="navbar navbar-expand-lg navbar-mil-sabores sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">Mil Sabores</Link>
        <button className="navbar-toggler" type="button" aria-controls="navMenu"
          aria-expanded={menuAbierto} onClick={() => setMenuAbierto(!menuAbierto)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuAbierto ? "show" : ""}`} id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {ENLACES.map((enlace) => (
              <li className="nav-item" key={enlace.ruta}>
                <NavLink className="nav-link" to={enlace.ruta} end={enlace.fin} onClick={() => setMenuAbierto(false)}>
                  {enlace.texto}
                </NavLink>
              </li>
            ))}
            {esAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin" onClick={() => setMenuAbierto(false)}>Administración</NavLink>
              </li>
            )}
            {usuario ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/mi-cuenta" onClick={() => setMenuAbierto(false)}>Mi cuenta</NavLink>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={salir}>Cerrar sesión</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login" onClick={() => setMenuAbierto(false)}>Iniciar sesión</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="btn btn-mil-sabores btn-sm ms-lg-2" to="/registro" onClick={() => setMenuAbierto(false)}>
                    Crear cuenta
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink className="nav-link position-relative" to="/carrito" onClick={() => setMenuAbierto(false)}>
                Carrito
                <span className="badge rounded-pill badge-carrito position-absolute top-0 start-100 translate-middle">
                  {cantidadTotal}
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
