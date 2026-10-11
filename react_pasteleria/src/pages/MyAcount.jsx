import { useEffect, useState } from "react";
import { useSesion } from "../context/SesionContext.jsx";
import { califica50, esCorreoDuoc, CODIGO_FELICES50 } from "../data/reglasNegocio.js";
import Alerta from "../components/Alerta.jsx";

// Badge de estado de un beneficio (activo / no aplica)
function Estado({ activo, textoActivo, textoInactivo }) {
  return (
    <span className={`badge rounded-pill ${activo ? "text-bg-success" : "text-bg-secondary"}`}>
      {activo ? textoActivo : textoInactivo}
    </span>
  );
}

export default function MiCuenta() {
  const { usuario, actualizarPerfil } = useSesion();
  const [datos, setDatos] = useState({ nombre: "", correo: "", fechaNacimiento: "", telefono: "" });
  const [codigo, setCodigo] = useState("");
  const [mensajeCodigo, setMensajeCodigo] = useState(null);
  const [mensajePerfil, setMensajePerfil] = useState(null);

  // Rellena el formulario con los datos del usuario en sesión
  useEffect(() => {
    if (usuario) {
      setDatos({
        nombre: usuario.nombre,
        correo: usuario.correo,
        fechaNacimiento: usuario.fechaNacimiento || "",
        telefono: usuario.telefono || "",
      });
    }
  }, [usuario]);

  if (!usuario) return null;

  const tieneDescuentoEdad = califica50(usuario.fechaNacimiento);
  const tieneTortaDuoc = esCorreoDuoc(usuario.correo);
  const tieneCodigo = usuario.codigoFelices50Aplicado === true;

  function guardar(e) {
    e.preventDefault();
    actualizarPerfil(usuario.correo, { fechaNacimiento: datos.fechaNacimiento, telefono: datos.telefono });
    setMensajePerfil({ tipo: "success", texto: "Cambios guardados." });
  }

  function aplicarCodigo() {
    if (codigo.trim().toUpperCase() !== CODIGO_FELICES50) {
      setMensajeCodigo({ tipo: "danger", texto: "El código ingresado no es válido." });
      return;
    }
    actualizarPerfil(usuario.correo, { codigoFelices50Aplicado: true });
    setCodigo("");
    setMensajeCodigo({ tipo: "success", texto: "¡Código aplicado con éxito!" });
  }

  return (
    <>
      <header className="hero-mil-sabores text-center">
        <div className="container">
          <h1>Mi cuenta</h1>
          <p className="fs-5 mx-auto" style={{ maxWidth: 600 }}>Revisa tus datos y beneficios activos.</p>
        </div>
      </header>
      <section className="seccion">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
              <article className="card-producto p-4 p-md-5 sombra-suave">
                <h2 className="h4 mb-4">Datos personales</h2>
                <form className="form-mil-sabores" onSubmit={guardar}>
                  <div className="mb-3">
                    <label htmlFor="perfilNombre" className="form-label">Nombre completo</label>
                    <input id="perfilNombre" className="form-control" value={datos.nombre} disabled />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="perfilCorreo" className="form-label">Correo electrónico</label>
                    <input id="perfilCorreo" className="form-control" value={datos.correo} disabled />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="perfilFechaNacimiento" className="form-label">Fecha de nacimiento</label>
                    <input id="perfilFechaNacimiento" type="date" className="form-control" value={datos.fechaNacimiento}
                      onChange={(e) => setDatos({ ...datos, fechaNacimiento: e.target.value })} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="perfilTelefono" className="form-label">Teléfono <span className="texto-secundario">(opcional)</span></label>
                    <input id="perfilTelefono" type="tel" className="form-control" placeholder="+56 9 1234 5678" value={datos.telefono}
                      onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-mil-sabores">Guardar cambios</button>
                  <Alerta tipo={mensajePerfil?.tipo}>{mensajePerfil?.texto}</Alerta>
                </form>
              </article>
            </div>

            <div className="col-lg-5">
              <article className="card-producto p-4 sombra-suave">
                <h2 className="h5 mb-3">Mis beneficios</h2>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2 d-flex justify-content-between align-items-start gap-2">
                    <span>🎂 <strong>Descuento 50%</strong> para socios de 50 años o más.</span>
                    <Estado activo={tieneDescuentoEdad} textoActivo="Activo" textoInactivo="No aplica" />
                  </li>
                  <li className="mb-2 d-flex justify-content-between align-items-start gap-2">
                    <span>🎓 <strong>Torta de cumpleaños gratis</strong> para registros con correo Duoc.</span>
                    <Estado activo={tieneTortaDuoc} textoActivo="Activo" textoInactivo="No aplica" />
                  </li>
                  <li className="mb-0 d-flex justify-content-between align-items-start gap-2">
                    <span>🎟️ <strong>Código FELICES50</strong> — 10% de descuento de por vida.</span>
                    <Estado activo={tieneCodigo} textoActivo="Aplicado" textoInactivo="No aplicado" />
                  </li>
                </ul>

                {!tieneCodigo && (
                  <div className="input-group input-group-sm mt-3">
                    <input type="text" className="form-control" placeholder="Ingresa un código promocional" maxLength={30}
                      value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                    <button type="button" className="btn btn-outline-secondary" onClick={aplicarCodigo}>Aplicar</button>
                  </div>
                )}
                <Alerta tipo={mensajeCodigo?.tipo}>{mensajeCodigo?.texto}</Alerta>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
