import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useColeccion } from "../hooks/useColeccion.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import ImagenProducto from "../components/ImagenProducto.jsx";
import Alerta from "../components/Alerta.jsx";
import { formatoPesos } from "../utils/formato.js";
import { precioUnitario, esStockCritico } from "../data/reglasNegocio.js";

// Ficha de detalle de producto (ruta /producto/:codigo)
export default function DetalleProducto() {
  const { codigo } = useParams();
  const productos = useColeccion("productos");
  const { agregar } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  const [aviso, setAviso] = useState(null);

  const producto = productos.find((p) => p.codigo === codigo);

  if (!producto) {
    return (
      <section className="seccion">
        <div className="container text-center py-5">
          <h3>No encontramos ese producto</h3>
          <p className="texto-secundario">Puede que el enlace esté incompleto. Vuelve al catálogo para seguir explorando.</p>
          <Link to="/catalogo" className="btn btn-mil-sabores">Ir al catálogo</Link>
        </div>
      </section>
    );
  }

  function añadir() {
    const r = agregar(producto.codigo, Number(cantidad));
    setAviso({ tipo: r.ok ? "success" : "danger", texto: r.mensaje });
  }

  return (
    <section className="seccion">
      <div className="container">
        <p><Link to="/catalogo">Volver al catálogo</Link></p>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card-producto detalle-img-producto">
              <ImagenProducto src={producto.imagen} alt={producto.nombre} categoria={producto.categoria} />
            </div>
          </div>
          <div className="col-md-6">
            <h1 className="fs-2">{producto.nombre}</h1>
            <p className="texto-secundario">{producto.descripcion}</p>
            <p className="precio fs-3">{formatoPesos(precioUnitario(producto))}</p>
            {producto.enOferta && <span className="badge text-bg-warning mb-2">En oferta: -{producto.descuentoOferta}%</span>}
            <p className="small mb-3">
              {producto.stock > 0 ? `Stock disponible: ${producto.stock}` : "Sin stock por el momento"}
              {esStockCritico(producto) && producto.stock > 0 && <span className="text-danger ms-2">¡Últimas unidades!</span>}
            </p>
            <label className="form-label" htmlFor="inputCantidad">Cantidad</label>
            <input id="inputCantidad" type="number" className="form-control mb-3" min="1"
              max={Math.max(producto.stock, 1)} value={cantidad} style={{ maxWidth: 120 }}
              onChange={(e) => setCantidad(e.target.value)} />
            <button className="btn btn-mil-sabores btn-lg w-100" disabled={producto.stock <= 0}
              onClick={añadir}>Añadir al carrito</button>
            <Alerta tipo={aviso?.tipo}>{aviso?.texto}</Alerta>
          </div>
        </div>
      </div>
    </section>
  );
}
