import { useEffect, useState } from "react";
import { contactoService } from "../../services/contactoService.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

export default function AdminContactos() {
  const [contactos, setContactos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function cargar() {
    setError("");
    try {
      setContactos(await contactoService.list());
    } catch (exception) {
      setError(getErrorMessage(exception));
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function borrar(contacto) {
    if (!window.confirm(`¿Eliminar el mensaje de ${contacto.nombre}?`)) return;
    try {
      await contactoService.remove(contacto.id);
      setMensaje(`Mensaje de ${contacto.nombre} eliminado.`);
      await cargar();
    } catch (exception) {
      setError(getErrorMessage(exception));
    }
  }

  return (
    <>
      <h1>Contactos (API)</h1>
      {error && <div className="alert alert-danger small py-2">{error}</div>}
      {mensaje && <div className="alert alert-info py-2 small">{mensaje}</div>}
      <div className="card-producto p-3 table-responsive">
        <table className="table table-striped mb-0">
          <thead><tr><th>Nombre</th><th>Correo</th><th>Comentario</th><th>Fecha entrega</th><th></th></tr></thead>
          <tbody>
            {contactos.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.correo}</td>
                <td>{c.comentario}</td>
                <td>{c.fechaEntrega || "—"}</td>
                <td className="text-end text-nowrap">
                  <button className="btn btn-sm btn-danger" onClick={() => borrar(c)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {contactos.length === 0 && <tr><td colSpan="5" className="text-secondary">No hay contactos registrados.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
