import { Link, useParams } from "react-router-dom";
import { useColeccion } from "../utils/useColeccion.js";
import { formatoPesos } from "../utils/formatPrice.js";

// Vista de compra exitosa y boleta. También la usa el administrador para "Mostrar boleta".
export default function Pedido() {
  const { numero } = useParams();
  const pedidos = useColeccion("pedidos");
  const pedido = pedidos.find((p) => p.numero === numero);

  if (!pedido) {
    return (
      <section className="seccion text-center">
        <div className="container">
          <h2>No encontramos un pedido reciente</h2>
          <Link to="/catalogo" className="btn btn-mil-sabores mt-3">Seguir comprando</Link>
        </div>
      </section>
    );
  }

  const { envio } = pedido;
  return (
    <section className="seccion">
      <div className="container">
        <div className="card-producto p-4 p-md-5 sombra-suave mx-auto" style={{ maxWidth: 760 }}>
          <div className="d-flex justify-content-between flex-wrap gap-2 mb-2">
            <h1 className="fs-3 mb-0">✓ Se ha realizado la compra</h1>
            <span className="small texto-secundario">Código de orden: {pedido.numero}</span>
          </div>
          <p className="texto-secundario">Autorización: {pedido.codigoAutorizacion || "—"}</p>

          <h5 className="mt-3">Datos de entrega</h5>
          <p className="mb-1"><strong>Nombre:</strong> {envio.nombre} {envio.apellidos}</p>
          <p className="mb-1"><strong>Correo:</strong> {envio.correo}</p>
          <p className="mb-1"><strong>Dirección:</strong> {envio.calle}{envio.departamento ? `, depto. ${envio.departamento}` : ""}, {envio.comuna}, {envio.region}</p>
          <p className="mb-1"><strong>Fecha:</strong> {envio.fechaEntrega} · {envio.horario}</p>
          {envio.indicaciones && <p className="mb-3"><strong>Indicaciones:</strong> {envio.indicaciones}</p>}

          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
              <tbody>
                {pedido.lineas.map((l) => (
                  <tr key={l.codigo}>
                    <td>{l.nombre}</td><td>{formatoPesos(l.precioUnitario)}</td><td>{l.cantidad}</td><td>{formatoPesos(l.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="small texto-secundario mb-2">
            {pedido.descuentoTortaDuoc > 0 && <div>Torta de cumpleaños Duoc: -{formatoPesos(pedido.descuentoTortaDuoc)}</div>}
            {pedido.descuentoEdad > 0 && <div>Descuento 50% por edad: -{formatoPesos(pedido.descuentoEdad)}</div>}
            {pedido.descuentoCodigo > 0 && <div>Código FELICES50: -{formatoPesos(pedido.descuentoCodigo)}</div>}
          </div>
          <div className="text-center p-3 rounded-4" style={{ background: "#fffaf1" }}>
            <span className="fs-5">Total pagado: <strong>{formatoPesos(pedido.total)}</strong></span>
          </div>

          <div className="d-flex justify-content-center gap-2 mt-4 no-imprimir">
            <button className="btn btn-danger btn-sm" onClick={() => window.print()}>Imprimir boleta en PDF</button>
            <Link to="/catalogo" className="btn btn-mil-sabores btn-sm">Seguir comprando</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
