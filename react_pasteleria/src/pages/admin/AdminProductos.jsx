import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { productoService } from "../../services/productoService";
import { esStockCritico } from "../../data/reglasNegocio.js";
import { formatoPesos } from "../../utils/formato.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

export default function AdminProductos() {
  const { usuario } = useAuth();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [texto, setTexto] = useState("");
  const [soloCriticos, setSoloCriticos] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      setProductos(await productoService.list());
    } catch (exception) {
      setError(getErrorMessage(exception));
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  const visibles = useMemo(() => productos.filter((p) =>
    (p.nombre || "").toLowerCase().includes(texto.toLowerCase()) && (!soloCriticos || esStockCritico(p))
  ), [productos, texto, soloCriticos]);

  async function borrar(producto) {
    if (!window.confirm(`¿Eliminar el producto ${producto.codigo}?`)) return;
    try {
      await productoService.remove(producto.id);
      setMensaje(`Producto ${producto.codigo} eliminado.`);
      await cargar();
    } catch (exception) {
      setError(getErrorMessage(exception));
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h1 className="mb-0">Productos (API)</h1>
        {usuario?.rol === "ADMIN" && (
          <Link to="/admin/productos/nuevo" className="btn btn-mil-sabores">+ Nuevo producto</Link>
        )}
      </div>

      {error && <div className="alert alert-danger small py-2">{error}</div>}
      {mensaje && <div className="alert alert-info py-2 small">{mensaje}</div>}

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <input type="search" className="form-control" style={{ maxWidth: 300 }} placeholder="Buscar por nombre"
          value={texto} onChange={(e) => setTexto(e.target.value)} />
        <div className="form-check ms-2">
          <input className="form-check-input" type="checkbox" id="soloCriticos" checked={soloCriticos}
            onChange={(e) => setSoloCriticos(e.target.checked)} />
          <label className="form-check-label" htmlFor="soloCriticos">Solo stock crítico</label>
        </div>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cargar} disabled={cargando}>Recargar</button>
      </div>

      <div className="card-producto p-3 table-responsive">
        {cargando ? <p>Cargando...</p> : (
          <table className="table table-striped mb-0">
            <thead>
              <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr>
            </thead>
            <tbody>
              {visibles.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.nombre} {esStockCritico(p) && <span className="badge text-bg-danger ms-1">Crítico</span>}</td>
                  <td>{p.categoria}</td>
                  <td>{formatoPesos(p.precio)}</td>
                  <td>{p.stock}</td>
                  <td className="text-end text-nowrap">
                    {usuario?.rol === "ADMIN" && (
                      <Link to={`/admin/productos/${p.codigo}/editar`} className="btn btn-sm btn-outline-mil-sabores me-1">Editar</Link>
                    )}
                    {usuario?.rol === "ADMIN" && (
                      <button className="btn btn-sm btn-danger" onClick={() => borrar(p)}>Eliminar</button>
                    )}
                  </td>
                </tr>
              ))}
              {visibles.length === 0 && <tr><td colSpan="6" className="texto-secundario">No hay productos que coincidan.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
