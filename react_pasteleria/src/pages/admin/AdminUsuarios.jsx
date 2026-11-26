import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usuarioService } from "../../services/usuarioService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { normalizarRol } from "../../utils/roles.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

const TIPOS = ["cliente", "vendedor", "administrador"];

export default function AdminUsuarios() {
  const { usuario: sesion } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function cargar() {
    setError("");
    try {
      setUsuarios(await usuarioService.list());
    } catch (exception) {
      setError(getErrorMessage(exception));
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function cambiarTipo(usuario, tipo) {
    try {
      await usuarioService.update(usuario.id, { ...usuario, tipo });
      setMensaje(`Rol de ${usuario.correo} actualizado a ${tipo}.`);
      await cargar();
    } catch (exception) {
      setError(getErrorMessage(exception));
    }
  }

  async function borrar(usuario) {
    if (!window.confirm(`¿Eliminar la cuenta ${usuario.correo}?`)) return;
    try {
      await usuarioService.remove(usuario.id);
      setMensaje(`Cuenta ${usuario.correo} eliminada.`);
      await cargar();
    } catch (exception) {
      setError(getErrorMessage(exception));
    }
  }

  return (
    <>
      <h1>Usuarios (API)</h1>
      {error && <div className="alert alert-danger small py-2">{error}</div>}
      {mensaje && <div className="alert alert-info py-2 small">{mensaje}</div>}
      <div className="card-producto p-3 table-responsive">
        <table className="table table-striped mb-0">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Tipo</th><th></th></tr></thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>
                  <select className="form-select form-select-sm" value={normalizarRol(u.tipo)} disabled={u.correo === sesion?.correo}
                    onChange={(e) => cambiarTipo(u, e.target.value)}>
                    {TIPOS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/usuarios/${encodeURIComponent(u.correo)}/historial`} className="btn btn-sm btn-outline-mil-sabores me-1">Historial</Link>
                  <button className="btn btn-sm btn-danger" disabled={u.correo === sesion?.correo} onClick={() => borrar(u)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
