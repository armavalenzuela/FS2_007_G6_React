import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { pedidoService } from "../../services/pedidoService.js";
import { formatoPesos } from "../../utils/formato.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

function normalizarPedido(p) {
  let envio = p.envio;
  if (typeof envio === "string") {
    try { envio = JSON.parse(envio); } catch (e) { envio = {}; }
  }
  let lineas = p.lineas;
  if (typeof lineas === "string") {
    try { lineas = JSON.parse(lineas); } catch (e) { lineas = []; }
  }
  return { ...p, envio: envio || {}, lineas: lineas || [] };
}

const ESTADOS = ["pagado"];
const CLASE_ESTADO = {
  pagado: "text-bg-success",
};

export function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      const lista = await pedidoService.list();
      setPedidos(lista.map(normalizarPedido));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function cambiarEstado(pedido, estado) {
    try {
      await pedidoService.update(pedido.id, { ...pedido, estado });
      setMensaje(`Estado de ${pedido.numero} actualizado a ${estado}.`);
      await cargar();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  async function borrar(pedido) {
    if (!window.confirm(`¿Eliminar el pedido ${pedido.numero}?`)) return;
    try {
      await pedidoService.remove(pedido.id);
      setMensaje(`Pedido ${pedido.numero} eliminado.`);
      await cargar();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  if (cargando) return <p>Cargando pedidos...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <h1>Órdenes / boletas</h1>
      {mensaje && <div className="alert alert-info small py-2">{mensaje}</div>}
      <TablaPedidos pedidos={pedidos} onCambiarEstado={cambiarEstado} onBorrar={borrar} />
    </>
  );
}

export function HistorialUsuario() {
  const { correo } = useParams();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError("");
    pedidoService.historial(correo)
      .then((lista) => {
        if (activo) setPedidos(lista.map(normalizarPedido));
      })
      .catch((e) => { if (activo) setError(getErrorMessage(e)); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [correo]);

  if (cargando) return <p>Cargando historial...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  return (
    <>
      <p><Link to="/admin/usuarios">← Volver a usuarios</Link></p>
      <h1>Historial de compras</h1>
      <p className="texto-secundario">{correo}</p>
      <TablaPedidos pedidos={pedidos} />
    </>
  );
}

function TablaPedidos({ pedidos, onCambiarEstado, onBorrar }) {
  return (
    <div className="card-producto p-3 table-responsive">
      <table className="table table-striped mb-0">
        <thead><tr><th>N.º</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.numero}>
              <td>{p.numero}</td>
              <td>{p.fecha ? new Date(p.fecha).toLocaleDateString("es-CL") : "—"}</td>
              <td>{p.envio?.nombre} {p.envio?.apellidos}</td>
              <td>{formatoPesos(p.total)}</td>
              <td>
                {onCambiarEstado ? (
                  <select className="form-select form-select-sm" value={p.estado} onChange={(e) => onCambiarEstado(p, e.target.value)}>
                    {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                ) : (
                  <span className={`badge ${CLASE_ESTADO[p.estado] || "text-bg-secondary"}`}>{p.estado}</span>
                )}
              </td>
              <td className="text-end text-nowrap">
                <Link to={`/pedido/${p.numero}`} className="btn btn-sm btn-outline-mil-sabores me-1">Mostrar boleta</Link>
                {onBorrar && <button className="btn btn-sm btn-danger" onClick={() => onBorrar(p)}>Eliminar</button>}
              </td>
            </tr>
          ))}
          {pedidos.length === 0 && <tr><td colSpan="6" className="texto-secundario">Aún no hay pedidos registrados.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}