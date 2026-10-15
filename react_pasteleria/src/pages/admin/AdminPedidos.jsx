import { Link, useParams } from "react-router-dom";
import { useColeccion } from "../../hooks/useColeccion.js";
import { formatoPesos } from "../../utils/formato.js";

export function AdminPedidos() {
  const pedidos = useColeccion("pedidos");
  return (
    <>
      <h1>Órdenes / boletas</h1>
      <TablaPedidos pedidos={pedidos} />
    </>
  );
}

export function HistorialUsuario() {
  const { correo } = useParams();
  const pedidos = useColeccion("pedidos");
  const delUsuario = pedidos.filter((p) => p.usuarioCorreo === correo);
  return (
    <>
      <p><Link to="/admin/usuarios">← Volver a usuarios</Link></p>
      <h1>Historial de compras</h1>
      <p className="texto-secundario">{correo}</p>
      <TablaPedidos pedidos={delUsuario} />
    </>
  );
}

const CLASE_ESTADO = {
  pagado: "text-bg-success",
  preparacion: "text-bg-primary",
  en_camino: "text-bg-info",
  cancelado: "text-bg-danger",
};

function TablaPedidos({ pedidos }) {
  return (
    <div className="card-producto p-3 table-responsive">
      <table className="table table-striped mb-0">
        <thead><tr><th>N.º</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.numero}>
              <td>{p.numero}</td>
              <td>{new Date(p.fecha).toLocaleDateString("es-CL")}</td>
              <td>{p.envio.nombre} {p.envio.apellidos}</td>
              <td>{formatoPesos(p.total)}</td>
              <td><span className={`badge ${CLASE_ESTADO[p.estado] || "text-bg-secondary"}`}>{p.estado}</span></td>
              <td className="text-end"><Link to={`/pedido/${p.numero}`} className="btn btn-sm btn-outline-mil-sabores">Mostrar boleta</Link></td>
            </tr>
          ))}
          {pedidos.length === 0 && <tr><td colSpan="6" className="texto-secundario">Aún no hay pedidos registrados.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
