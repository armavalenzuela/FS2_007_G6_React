import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useColeccion } from "../../hooks/useColeccion.js";
import { eliminar } from "../../data/baseDatos.js";
import { esStockCritico } from "../../data/reglasNegocio.js";
import { formatoPesos } from "../../utils/formato.js";
import { useSesion } from "../../context/SesionContext.jsx";

// Listado de productos con busqueda, filtro de stock crítico y eliminacion
export default function AdminProductos() {
  const productos = useColeccion("productos");
  const { usuario } = useSesion();
  const [texto, setTexto] = useState("");
  const [soloCriticos, setSoloCriticos] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const visibles = useMemo(() => productos.filter((p) =>
    p.nombre.toLowerCase().includes(texto.toLowerCase()) && (!soloCriticos || esStockCritico(p))
  ), [productos, texto, soloCriticos]);

  function borrar(codigo) {
    if (!window.confirm(`¿Eliminar el producto ${codigo}?`)) return;
    eliminar("productos", codigo);
    setMensaje(`Producto ${codigo} eliminado.`);
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h1 className="mb-0">Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-mil-sabores">+ Nuevo producto</Link>
      </div>

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <input type="search" className="form-control" style={{ maxWidth: 300 }} placeholder="Buscar por nombre"
          aria-label="Buscar producto por nombre" value={texto} onChange={(e) => setTexto(e.target.value)} />
        <div className="form-check ms-2">
          <input className="form-check-input" type="checkbox" id="soloCriticos" checked={soloCriticos}
            onChange={(e) => setSoloCriticos(e.target.checked)} />
          <label className="form-check-label" htmlFor="soloCriticos">Solo stock crítico</label>
        </div>
      </div>

      {mensaje && <div className="alert alert-info py-2 small">{mensaje}</div>}

      <div className="card-producto p-3 table-responsive">
        <table className="table table-striped mb-0">
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.codigo}>
                <td>{p.codigo}</td>
                <td>{p.nombre} {esStockCritico(p) && <span className="badge text-bg-danger ms-1">Crítico</span>}</td>
                <td>{p.categoria}</td>
                <td>{formatoPesos(p.precio)}</td>
                <td>{p.stock}</td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/productos/${p.codigo}/editar`} className="btn btn-sm btn-outline-mil-sabores me-1">Editar</Link>
                  {usuario.tipo === "administrador" && (
                    <button className="btn btn-sm btn-danger" onClick={() => borrar(p.codigo)}>Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
            {visibles.length === 0 && <tr><td colSpan="6" className="texto-secundario">No hay productos que coincidan.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
