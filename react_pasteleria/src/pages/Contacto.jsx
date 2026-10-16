import { useState } from "react";
import { crear } from "../data/baseDatos.js";
import { comentarioValido, nombreValido } from "../utils/validaciones.js";

const FORMULARIO_VACIO = { nombre: "", correo: "", comentario: "" };

export default function Contacto() {
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(evento) {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
    setEnviado(false);
  }

  function enviar(evento) {
    evento.preventDefault();
    const nuevosErrores = {};

    if (!nombreValido(formulario.nombre)) {
      nuevosErrores.nombre = "El nombre debe contener solo letras.";
    }
    if (!/^\S+@\S+\.\S+$/.test(formulario.correo.trim())) {
      nuevosErrores.correo = "Ingresa un correo válido.";
    }
    if (!comentarioValido(formulario.comentario)) {
      nuevosErrores.comentario = "Escribe un mensaje de hasta 500 caracteres.";
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    crear("contactos", {
      nombre: formulario.nombre.trim(),
      correo: formulario.correo.trim().toLowerCase(),
      comentario: formulario.comentario.trim(),
    });
    setFormulario(FORMULARIO_VACIO);
    setEnviado(true);
  }

  const clase = (campo) => `form-control ${errores[campo] ? "is-invalid" : ""}`;

  return (
    <section className="container py-5">
      <h1>Contacto</h1>
      <p>Envíanos tu consulta y te responderemos a la brevedad.</p>
      {enviado && <div className="alert alert-success" role="status">Tu mensaje fue enviado</div>}
      <form className="row g-3" onSubmit={enviar} noValidate>
        <div className="col-md-6">
          <label className="form-label" htmlFor="contactoNombre">Nombre</label>
          <input id="contactoNombre" name="nombre" className={clase("nombre")} value={formulario.nombre} onChange={cambiar} />
          {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="contactoCorreo">Correo electrónico</label>
          <input id="contactoCorreo" name="correo" type="email" className={clase("correo")} value={formulario.correo} onChange={cambiar} />
          {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="contactoComentario">Mensaje</label>
          <textarea id="contactoComentario" name="comentario" rows="5" maxLength="500" className={clase("comentario")} value={formulario.comentario} onChange={cambiar} />
          {errores.comentario && <div className="invalid-feedback">{errores.comentario}</div>}
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Enviar mensaje</button>
        </div>
      </form>
    </section>
  );
}
