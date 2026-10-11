import { Link } from "react-router-dom";
import ImagenProducto from "./ImagenProducto.jsx";
import { formatoPesos } from "../utils/formato.js";
import { precioUnitario } from "../data/reglasNegocio.js";

// Tarjeta reutilizable para los productos
export default function ProductCard({ producto, onAgregar, mostrarAgregar = true }) {
  const precioFinal = precioUnitario(producto);
  const sinStock = producto.stock <= 0;

  return (
    <div className="card-producto p-3 h-100 d-flex flex-column">
      <div className="card-img-top mb-3">
        <ImagenProducto src={producto.imagen} alt={producto.nombre} categoria={producto.categoria} />
      </div>
      <Link to={`/producto/${producto.codigo}`} className="text-decoration-none">
        <h6 className="mt-2">{producto.nombre}</h6>
      </Link>
      <p className="small texto-secundario mb-2">{producto.descripcion}</p>
      <div className="mb-2">
        {producto.enOferta && producto.descuentoOferta > 0 ? (
          <>
            <span className="text-decoration-line-through small me-2">{formatoPesos(producto.precio)}</span>
            <span className="precio">{formatoPesos(precioFinal)}</span>
            <span className="badge text-bg-warning ms-2">-{producto.descuentoOferta}%</span>
          </>
        ) : (
          <span className="precio">{formatoPesos(precioFinal)}</span>
        )}
      </div>
      {mostrarAgregar && (
        <button className="btn btn-mil-sabores btn-sm w-100 mt-auto" disabled={sinStock}
          onClick={() => onAgregar && onAgregar(producto.codigo)}>
          {sinStock ? "Sin stock" : "Añadir"}
        </button>
      )}
    </div>
  );
}
