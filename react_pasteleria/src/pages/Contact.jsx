import { useState } from "react";
import { crear } from "../data/baseDatos.js";
import { correoPermitido } from "../data/reglasNegocio.js";
import { nombreValido, comentarioValido } from "../utils/validaciones.js";
import { useSesion } from "../context/SesionContext.jsx";

export default function Contacto() {
  const { usuario } = useSesion();
  const [form, setForm] = useState({ nombre: usuario?.nombre || "", correo: usuario?.correo || "", comentario: "" });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setEnviado(false);
  }

  function enviar(e) {
    e.preventDefault();
    const nuevosErrores = {};
    if (!nombreValido(form.nombre)) nuevosErrores.nombre = "Ingresa un nombre válido usando solo letras (máximo 100 caracteres).";
    if (!correoPermitido(form.correo)) nuevosErrores.correo = "Ingresa un correo válido (@duoc.cl, @profesor.duoc.cl o @gmail.com).";
    if (!comentarioValido(form.comentario)) nuevosErrores.comentario = "Escribe tu comentario (máximo 500 caracteres).";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    crear("contactos", { nombre: form.nombre.trim(), correo: form.correo.trim(), comentario: form.comentario.trim(), fecha: new Date().toISOString() });
    setForm({ nombre: "", correo: "", comentario: "" });
    setEnviado(true);
  }

  const clase = (campo) => `form-control ${errores[campo] ? "is-invalid" : ""}`;

  return (
    <>
      <header className="hero-mil-sabores text-center">
        <div className="container">
          <h1>Contáctanos</h1>
          <p className="fs-5 mx-auto" style={{ maxWidth: 600 }}>¿Tienes dudas sobre un pedido o una torta personalizada? Escríbenos y te respondemos a la brevedad.</p>
        </div>
      </header>
      <section className="seccion">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <article className="card-producto p-4 p-md-5 sombra-suave">
                <form className="form-mil-sabores" onSubmit={enviar} noValidate>
                  <div className="mb-3">
                    <label htmlFor="contactoNombre" className="form-label">Nombre</label>
                    <input id="contactoNombre" name="nombre" className={clase("nombre")} value={form.nombre} onChange={cambiar} maxLength={100} />
                    <div className="invalid-feedback">{errores.nombre}</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contactoCorreo" className="form-label">Correo</label>
                    <input id="contactoCorreo" name="correo" type="email" className={clase("correo")} value={form.correo} onChange={cambiar} maxLength={100} />
                    <div className="form-text">Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.</div>
                    <div className="invalid-feedback">{errores.correo}</div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="contactoComentario" className="form-label">Comentario</label>
                    <textarea id="contactoComentario" name="comentario" rows="4" className={clase("comentario")} value={form.comentario} onChange={cambiar} maxLength={500} />
                    <div className="form-text">{form.comentario.length}/500</div>
                    <div className="invalid-feedback">{errores.comentario}</div>
                  </div>
                  <button type="submit" className="btn btn-mil-sabores btn-lg w-100">Enviar mensaje</button>
                  {enviado && <p className="text-center text-success mt-3 mb-0">¡Gracias! Tu mensaje fue enviado.</p>}
                </form>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
