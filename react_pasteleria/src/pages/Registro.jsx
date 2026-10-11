import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSesion } from "../context/SesionContext.jsx";
import { obtener } from "../data/baseDatos.js";
import { validarRegistro } from "../utils/validaciones.js";
import { CODIGO_FELICES50 } from "../data/reglasNegocio.js";

const VACIO = { nombre: "", correo: "", fechaNacimiento: "", contrasena: "", confirmacion: "", codigoPromocional: "", terminos: false };

export default function Registro() {
  const { registrar } = useSesion();
  const navegar = useNavigate();
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});

  function cambiar(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function enviar(e) {
    e.preventDefault();
    const codigo = form.codigoPromocional.trim().toUpperCase();
    const nuevosErrores = validarRegistro(form, (correo) => Boolean(obtener("usuarios", correo.trim().toLowerCase())));
    if (codigo && codigo !== CODIGO_FELICES50) {
      nuevosErrores.codigoPromocional = "El código ingresado no es válido.";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    registrar({ ...form, codigoFelices50Aplicado: codigo === CODIGO_FELICES50 });
    navegar("/mi-cuenta");
  }

  const clase = (campo) => `form-control ${errores[campo] ? "is-invalid" : ""}`;

  return (
    <>
      <header className="hero-mil-sabores text-center">
        <div className="container">
          <span className="chip-categoria mb-3 d-inline-block">Únete a Mil Sabores</span>
          <h1>Crea tu cuenta</h1>
          <p className="fs-5 mx-auto" style={{ maxWidth: 650 }}>Regístrate y descubre beneficios exclusivos: descuentos por edad, códigos promocionales y regalos de cumpleaños para estudiantes Duoc.</p>
        </div>
      </header>
      <section className="seccion">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <article className="card-producto p-4 p-md-5 sombra-suave">
                <div className="p-3 rounded-4 mb-4" style={{ background: "#fffaf1", border: "1px solid var(--color-borde)" }}>
                  <p className="small mb-1"><strong>🎂 Descuento 50%:</strong> automático para socios de 50 años o más.</p>
                  <p className="small mb-1"><strong>🎟️ Código FELICES50:</strong> 10% de descuento de por vida.</p>
                  <p className="small mb-0"><strong>🎓 Correo institucional Duoc:</strong> torta de cumpleaños gratis.</p>
                </div>

                <form className="form-mil-sabores" onSubmit={enviar} noValidate>
                  <div className="mb-3">
                    <label htmlFor="signupNombre" className="form-label">Nombre completo</label>
                    <input id="signupNombre" name="nombre" className={clase("nombre")} placeholder="Ej: María Pérez" value={form.nombre} onChange={cambiar} />
                    <div className="invalid-feedback">{errores.nombre}</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="signupCorreo" className="form-label">Correo electrónico</label>
                    <input id="signupCorreo" name="correo" type="email" className={clase("correo")} placeholder="tucorreo@ejemplo.com" value={form.correo} onChange={cambiar} />
                    <div className="form-text">Si usas un correo @duoc.cl o @profesor.duoc.cl, se activará el beneficio de cumpleaños para estudiantes Duoc.</div>
                    <div className="invalid-feedback">{errores.correo}</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="signupFechaNacimiento" className="form-label">Fecha de nacimiento</label>
                    <input id="signupFechaNacimiento" name="fechaNacimiento" type="date" className={clase("fechaNacimiento")} value={form.fechaNacimiento} onChange={cambiar} />
                    <div className="form-text">La usamos solo para calcular tu descuento por edad.</div>
                    <div className="invalid-feedback">{errores.fechaNacimiento}</div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="signupPassword" className="form-label">Contraseña</label>
                      <input id="signupPassword" name="contrasena" type="password" className={clase("contrasena")} value={form.contrasena} onChange={cambiar} />
                      <div className="form-text">Entre 8 y 10 caracteres.</div>
                      <div className="invalid-feedback">{errores.contrasena}</div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="signupPasswordConfirm" className="form-label">Confirmar contraseña</label>
                      <input id="signupPasswordConfirm" name="confirmacion" type="password" className={clase("confirmacion")} value={form.confirmacion} onChange={cambiar} />
                      <div className="invalid-feedback">{errores.confirmacion}</div>
                    </div>
                  </div>

                  <div className="mb-3 mt-3">
                    <label htmlFor="signupCodigo" className="form-label">Código promocional <span className="texto-secundario">(opcional)</span></label>
                    <input id="signupCodigo" name="codigoPromocional" className={clase("codigoPromocional")} placeholder="Ej: FELICES50" value={form.codigoPromocional} onChange={cambiar} autoComplete="off" />
                    <div className="invalid-feedback">{errores.codigoPromocional}</div>
                  </div>

                  <div className="mb-4 form-check">
                    <input id="signupTerminos" name="terminos" type="checkbox" className={`form-check-input ${errores.terminos ? "is-invalid" : ""}`} checked={form.terminos} onChange={cambiar} />
                    <label className="form-check-label" htmlFor="signupTerminos">Acepto los términos y condiciones y la política de privacidad.</label>
                    <div className="invalid-feedback">{errores.terminos}</div>
                  </div>

                  <button type="submit" className="btn btn-mil-sabores btn-lg w-100">Crear mi cuenta</button>
                </form>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
