import { Link, useNavigate } from "react-router-dom";
import { useColeccion } from "../hooks/useColeccion.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { calcularTotales, validarStock, precioUnitario } from "../data/reglasNegocio.js";
import { formatoPesos } from "../utils/formato.js";
import ImagenProducto from "../components/ImagenProducto.jsx";
import Alerta from "../components/Alerta.jsx";
import { useState } from "react";

export default function Carrito() {
  const productos = useColeccion("productos");
  const { items, cambiarCantidad, quitar, vaciar } = useCarrito();
  const { usuario } = useSesion();
  const navegar = useNavigate();
  const [aviso, setAviso] = useState(null);

  const resumen = calcularTotales(items, productos, usuario);

  function continuar() {
    const problemas = validarStock(items, productos);
    if (problemas.length > 0) {
      setAviso({ tipo: "danger", texto: `${problemas[0].motivo}. Ajusta tu carrito para continuar.` });
      return;
    }
    navegar("/checkout");
  }

  function vaciarCarrito() {
    vaciar();
    setAviso(null);
  }

  return (
    <>
      <header className="hero-mil-sabores py-4">
        <div className="container"><h1 className="mb-0">Tu carrito de compras</h1></div>
      </header>
      <section className="seccion">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              {items.length === 0 ? (
                <p className="texto-secundario">Tu carrito está vacío. <Link to="/catalogo">Ir al catálogo</Link></p>
              ) : (
                <div className="card-producto carrito-lista p-3 p-md-4 sombra-suave">
                  {items.map((item) => {
                    const producto = productos.find((p) => p.codigo === item.codigo);
                    if (!producto) {
                      return (
                        <div key={item.codigo} className="carrito-linea d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                          <div className="carrito-texto">
                            <h6 className="mb-1 text-break">Producto no disponible</h6>
                            <p className="small texto-secundario mb-0">Este producto ya no está a la venta.</p>
                          </div>
                          <button className="btn btn-outline-mil-sabores btn-sm align-self-end align-self-sm-auto" onClick={() => quitar(item.codigo)}>Quitar</button>
                        </div>
                      );
                    }
                    return (
                      <div key={item.codigo} className="carrito-linea d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
                        <div className="d-flex align-items-center gap-3 carrito-detalle">
                          <div className="carrito-imagen">
                            <ImagenProducto src={producto.imagen} alt={producto.nombre} categoria={producto.categoria} />
                          </div>
                          <div className="carrito-texto">
                            <h6 className="mb-1 text-break">{producto.nombre}</h6>
                            <p className="small texto-secundario mb-0">{formatoPesos(precioUnitario(producto))} c/u</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 align-self-end align-self-sm-auto">
                          <input type="number" min="1" max={producto.stock} value={item.cantidad}
                            className="form-control" style={{ width: 80 }} aria-label={`Cantidad de ${producto.nombre}`}
                            onChange={(e) => {
                              const nueva = Number(e.target.value);
                              if (Number.isInteger(nueva) && nueva >= 1) cambiarCantidad(item.codigo, nueva);
                            }} />
                          <button className="btn btn-outline-mil-sabores btn-sm" onClick={() => quitar(item.codigo)}>Quitar</button>
                        </div>
                      </div>
                    );
                  })}
                  <button className="btn btn-outline-danger btn-sm mt-3 align-self-start" onClick={vaciarCarrito}>
                    Vaciar carrito
                  </button>
                </div>
              )}
              <Alerta tipo={aviso?.tipo}>{aviso?.texto}</Alerta>
            </div>

            <div className="col-lg-4">
              <div className="card-producto p-4 sombra-suave">
                <h5 className="mb-3">Resumen del pedido</h5>
                <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>{formatoPesos(resumen.subtotal)}</span></div>
                {resumen.descuentoTortaDuoc > 0 && (
                  <div className="d-flex justify-content-between mb-2 texto-secundario"><span>Torta de cumpleaños Duoc</span><span>-{formatoPesos(resumen.descuentoTortaDuoc)}</span></div>
                )}
                {resumen.descuentoEdad > 0 && (
                  <div className="d-flex justify-content-between mb-2 texto-secundario"><span>Descuento 50% por edad</span><span>-{formatoPesos(resumen.descuentoEdad)}</span></div>
                )}
                {resumen.descuentoCodigo > 0 && (
                  <div className="d-flex justify-content-between mb-2 texto-secundario"><span>Código FELICES50 (10%)</span><span>-{formatoPesos(resumen.descuentoCodigo)}</span></div>
                )}
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold mb-3"><span>Total</span><span>{formatoPesos(resumen.total)}</span></div>
                {!usuario && (
                  <p className="small texto-secundario">
                    ¿Tienes 50 años o más, o un código de descuento? <Link to="/registro">Regístrate</Link> para aplicar tu descuento automáticamente.
                  </p>
                )}
                <button className="btn btn-mil-sabores btn-lg w-100" disabled={items.length === 0} onClick={continuar}>
                  Continuar con el pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
