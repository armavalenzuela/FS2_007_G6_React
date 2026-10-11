import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";
import { validarLogin } from "../utils/validaciones.js";

// Destino según el tipo de usuario, redireccionado después de iniciar sesion
const DESTINOS = { administrador: "/admin", vendedor: "/admin/productos", cliente: "/mi-cuenta" };

export default function Login() {
  const { login } = useSesion();
  const navegar = useNavigate();
  const [form, setForm] = useState({ correo: "", contrasena: "" });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  function enviar(e) {
    e.preventDefault();
    const nuevosErrores = validarLogin(form);
    setErrores(nuevosErrores);
    setErrorGeneral("");
    if (Object.keys(nuevosErrores).length > 0) return;

    const usuario = login(form.correo, form.contrasena);
    if (!usuario) {
      setErrorGeneral("Correo o contraseña incorrectos.");
      return;
    }
    navegar(DESTINOS[usuario.tipo] || "/mi-cuenta");
  }

  return (
    <>
      <header className="hero-mil-sabores text-center">
        <div className="container">
          <h1>Inicia sesión</h1>
          <p className="fs-5 mx-auto" style={{ maxWidth: 600 }}>Ingresa a tu cuenta para ver tus descuentos, tu historial de pedidos y seguir el estado de tus tortas.</p>
        </div>
      </header>
      <section className="seccion">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <article className="card-producto p-4 p-md-5 sombra-suave">
                <form className="form-mil-sabores" onSubmit={enviar} noValidate>
                  <div className="mb-3">
                    <label htmlFor="loginCorreo" className="form-label">Correo electrónico</label>
                    <input id="loginCorreo" type="email" className={`form-control ${errores.correo ? "is-invalid" : ""}`}
                      placeholder="tucorreo@ejemplo.com" value={form.correo}
                      onChange={(e) => setForm({ ...form, correo: e.target.value })} />
                    <div className="invalid-feedback">{errores.correo}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="loginPassword" className="form-label">Contraseña</label>
                    <input id="loginPassword" type="password" className={`form-control ${errores.contrasena ? "is-invalid" : ""}`}
                      value={form.contrasena} onChange={(e) => setForm({ ...form, contrasena: e.target.value })} />
                    <div className="invalid-feedback">{errores.contrasena}</div>
                  </div>
                  {errorGeneral && <div className="alert alert-danger small py-2">{errorGeneral}</div>}
                  <button type="submit" className="btn btn-mil-sabores btn-lg w-100">Iniciar sesión</button>
                  <p className="text-center small mt-3 mb-0">
                    ¿Aún no tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
                  </p>
                </form>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
