import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { usuarioService } from "../services/usuarioService.js";
import { califica50, esCorreoDuoc } from "../data/reglasNegocio.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";
import Alerta from "../components/Alerta.jsx";

function Estado({ activo, textoActivo, textoInactivo }) {
  return (
    <span className={`badge rounded-pill ${activo ? "text-bg-success" : "text-bg-secondary"}`}>
      {activo ? textoActivo : textoInactivo}
    </span>
  );
}

export default function MiCuenta() {
  const { usuario: authUsuario } = useAuth();
  const correo = authUsuario?.correo;
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");
  const [datos, setDatos] = useState({ nombre: "", correo: "", fechaNacimiento: "", telefono: "" });
  const [codigo, setCodigo] = useState("");
  const [mensajeCodigo, setMensajeCodigo] = useState(null);
  const [mensajePerfil, setMensajePerfil] = useState(null);

  useEffect(() => {
    let activo = true;
    setUsuario(null);
    setError("");
    usuarioService.perfil()
      .then((perfil) => {
        if (!activo) return;
        setUsuario(perfil);
        setDatos({
          nombre: perfil.nombre,
          correo: perfil.correo,
          fechaNacimiento: perfil.fechaNacimiento || "",
          telefono: perfil.telefono || "",
        });
      })
      .catch((err) => { if (activo) setError(getErrorMessage(err)); });
    return () => { activo = false; };
  }, [correo]);

  const tieneDescuentoEdad = califica50(usuario?.fechaNacimiento);
  const tieneTortaDuoc = esCorreoDuoc(usuario?.correo);
  const tieneCodigo = usuario?.codigoFelices50Aplicado === true;

  async function guardar(e) {
    e.preventDefault();
    try {
      const actualizado = await usuarioService.actualizarPerfil({ fechaNacimiento: datos.fechaNacimiento, telefono: datos.telefono });
      setUsuario(actualizado);
      setMensajePerfil({ tipo: "success", texto: "Cambios guardados." });
    } catch (err) {
      setMensajePerfil({ tipo: "danger", texto: "No se pudo guardar." });
    }
  }

  async function aplicarCodigo() {
    if (!codigo.trim()) {
      setMensajeCodigo({ tipo: "danger", texto: "Ingresa un código promocional." });
      return;
    }
    try {
      const actualizado = await usuarioService.actualizarPerfil({ codigoPromocional: codigo });
      setUsuario(actualizado);
      setCodigo("");
      setMensajeCodigo({ tipo: "success", texto: "¡Código aplicado con éxito!" });
    } catch (err) {
      setMensajeCodigo({ tipo: "danger", texto: getErrorMessage(err) });
    }
  }

  if (error) return <section className="container py-5"><Alerta tipo="danger">{error}</Alerta></section>;
  if (!usuario) return <section className="seccion text-center"><div className="container"><p>Cargando cuenta...</p></div></section>;

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