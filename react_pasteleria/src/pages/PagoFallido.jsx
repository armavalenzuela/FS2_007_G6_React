import { Link, useLocation } from "react-router-dom";
import { formatoPesos } from "../utils/formato.js";

export default function PagoFallido() {
  const { state } = useLocation();
  return (
    <section className="seccion">
      <div className="container">
        <div className="card-producto p-4 p-md-5 sombra-suave mx-auto text-center" style={{ maxWidth: 560 }}>
          <h1 className="fs-3">✕ No se pudo realizar el pago</h1>
          <p className="texto-secundario">
            {state?.total ? `El cobro de ${formatoPesos(state.total)} no fue aprobado. ` : ""}
            Tu carrito se mantiene para que intentes nuevamente.
          </p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <Link to="/checkout" className="btn btn-mil-sabores">Volver a realizar el pago</Link>
            <Link to="/carrito" className="btn btn-outline-mil-sabores">Volver al carrito</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
