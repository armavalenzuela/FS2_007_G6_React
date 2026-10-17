import { useState } from "react";
import { Link } from "react-router-dom";
import { useColeccion } from "../../hooks/useColeccion.js";
import { actualizar, eliminar } from "../../data/baseDatos.js";
import { useSesion } from "../../context/SesionContext.jsx";

const TIPOS = ["cliente", "vendedor", "administrador"];

// Listado de usuarios: cambiar rol, eliminar cuenta e ir al historial de compras
export default function AdminUsuarios() {
  const usuarios = useColeccion("usuarios");
  const { usuario: sesion } = useSesion();
  const [mensaje, setMensaje] = useState("");

  function cambiarTipo(correo, tipo) {
    actualizar("usuarios", correo, { tipo });
    setMensaje(`Rol de ${correo} actualizado a ${tipo}.`);
  }

  function borrar(correo) {
    if (!window.confirm(`¿Eliminar la cuenta ${correo}?`)) return;
    eliminar("usuarios", correo);
    setMensaje(`Cuenta ${correo} eliminada.`);
  }

  return (
    <>
      <h1>Usuarios</h1>
      {mensaje && <div className="alert alert-info py-2 small">{mensaje}</div>}
      <div className="card-producto p-3 table-responsive">
        <table className="table table-striped mb-0">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Tipo</th><th></th></tr></thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.correo}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>
                  <select className="form-select form-select-sm" value={u.tipo} disabled={u.correo === sesion.correo}
                    onChange={(e) => cambiarTipo(u.correo, e.target.value)}>
                    {TIPOS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/usuarios/${encodeURIComponent(u.correo)}/historial`} className="btn btn-sm btn-outline-mil-sabores me-1">Historial</Link>
                  <button className="btn btn-sm btn-danger" disabled={u.correo === sesion.correo} onClick={() => borrar(u.correo)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}