import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { REGIONES } from "../data/regiones.js";
import { calcularTotales, validarStock } from "../data/reglasNegocio.js";
import { METODOS_PAGO, procesarPago } from "../utils/pagos.js";
import { registrarPedido } from "../utils/pedidos.js";
import { formatoPesos } from "../utils/formatPrice.js";
import { useColeccion } from "../utils/useColeccion.js";
import Alerta from "../components/organisms/Alerta.jsx";

const REGION_INICIAL = REGIONES[0];
const DATOS_ENVIO_INICIALES = {
  nombre: "",
  apellidos: "",
  correo: "",
  calle: "",
  departamento: "",
  comuna: REGION_INICIAL.comunas[0],
  region: REGION_INICIAL.nombre,
  fechaEntrega: "",
  horario: "",
  indicaciones: "",
};

export default function Checkout() {
  const productos = useColeccion("productos");
  const { items, vaciar } = useCarrito();
  const { usuario } = useSesion();
  const navegar = useNavigate();
  const [datosEnvio, setDatosEnvio] = useState(() => ({
    ...DATOS_ENVIO_INICIALES,
    nombre: usuario?.nombre.split(" ")[0] || "",
    apellidos: usuario?.nombre.split(" ").slice(1).join(" ") || "",
    correo: usuario?.correo || "",
  }));
  const [metodoPago, setMetodoPago] = useState(METODOS_PAGO[0]);
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);
  const resumen = calcularTotales(items, productos, usuario);
  const regionSeleccionada = REGIONES.find((region) => region.nombre === datosEnvio.region);

  function cambiarEnvio(evento) {
    const { name, value } = evento.target;
    setDatosEnvio((actuales) => {
      if (name === "region") {
        const region = REGIONES.find((opcion) => opcion.nombre === value);
        return { ...actuales, region: value, comuna: region?.comunas[0] || "" };
      }
      return { ...actuales, [name]: value };
    });
  }

  async function enviarPedido(evento) {
    evento.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Tu carrito está vacío. Agrega productos antes de continuar.");
      return;
    }

    const requeridos = ["nombre", "apellidos", "correo", "calle", "comuna", "region", "fechaEntrega", "horario"];
    if (requeridos.some((campo) => !datosEnvio[campo].trim())) {
      setError("Completa todos los campos obligatorios para continuar.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datosEnvio.correo)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    const problemasStock = validarStock(items, productos);
    if (problemasStock.length > 0) {
      setError(`${problemasStock[0].motivo}. Vuelve al carrito y ajusta las cantidades.`);
      return;
    }

    setProcesando(true);
    try {
      const pago = await procesarPago({ total: resumen.total, metodo: metodoPago });
      if (!pago.aprobado) {
        setError("El pago fue rechazado. Selecciona otro método de pago e inténtalo nuevamente.");
        return;
      }

      const pedido = registrarPedido({
        items,
        datosEnvio,
        usuario,
        metodoPago,
        codigoAutorizacion: pago.codigoAutorizacion,
      });
      vaciar();
      navegar(`/pedido/${pedido.numero}`);
    } catch (errorPedido) {
      console.error("No se pudo registrar el pedido:", errorPedido);
      setError("No pudimos registrar tu pedido. Revisa tu conexión e inténtalo nuevamente.");
    } finally {
      setProcesando(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="seccion">
        <div className="container text-center">
          <h1>Tu carrito está vacío</h1>
          <Link className="btn btn-mil-sabores mt-3" to="/catalogo">Volver al catálogo</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <header className="hero-mil-sabores py-4">
        <div className="container"><h1 className="mb-0">Finalizar pedido</h1></div>
      </header>
      <section className="seccion">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
              <form className="card-producto form-mil-sabores p-4 sombra-suave" onSubmit={enviarPedido}>
                <h2 className="h4 mb-3">Datos de entrega</h2>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="envioNombre">Nombre</label>
                    <input className="form-control" id="envioNombre" name="nombre" value={datosEnvio.nombre} onChange={cambiarEnvio} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="envioApellidos">Apellidos</label>
                    <input className="form-control" id="envioApellidos" name="apellidos" value={datosEnvio.apellidos} onChange={cambiarEnvio} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="envioCorreo">Correo electrónico</label>
                    <input className="form-control" id="envioCorreo" name="correo" type="email" value={datosEnvio.correo} onChange={cambiarEnvio} required />
                  </div>
                  <div className="col-md-8">
                    <label className="form-label" htmlFor="envioCalle">Calle y número</label>
                    <input className="form-control" id="envioCalle" name="calle" value={datosEnvio.calle} onChange={cambiarEnvio} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="envioDepartamento">Depto. (opcional)</label>
                    <input className="form-control" id="envioDepartamento" name="departamento" value={datosEnvio.departamento} onChange={cambiarEnvio} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="envioRegion">Región</label>
                    <select className="form-select" id="envioRegion" name="region" value={datosEnvio.region} onChange={cambiarEnvio} required>
                      {REGIONES.map((region) => <option key={region.nombre} value={region.nombre}>{region.nombre}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="envioComuna">Comuna</label>
                    <select className="form-select" id="envioComuna" name="comuna" value={datosEnvio.comuna} onChange={cambiarEnvio} required>
                      {(regionSeleccionada?.comunas || []).map((comuna) => <option key={comuna} value={comuna}>{comuna}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="envioFecha">Fecha de entrega</label>
                    <input className="form-control" id="envioFecha" name="fechaEntrega" type="date" min={new Date().toISOString().slice(0, 10)} value={datosEnvio.fechaEntrega} onChange={cambiarEnvio} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="envioHorario">Horario</label>
                    <select className="form-select" id="envioHorario" name="horario" value={datosEnvio.horario} onChange={cambiarEnvio} required>
                      <option value="">Selecciona un horario</option>
                      <option value="09:00 - 13:00">09:00 - 13:00</option>
                      <option value="14:00 - 18:00">14:00 - 18:00</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="envioIndicaciones">Indicaciones (opcional)</label>
                    <textarea className="form-control" id="envioIndicaciones" name="indicaciones" rows="3" value={datosEnvio.indicaciones} onChange={cambiarEnvio} />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="metodoPago">Método de pago</label>
                    <select className="form-select" id="metodoPago" value={metodoPago} onChange={(evento) => setMetodoPago(evento.target.value)}>
                      {METODOS_PAGO.map((metodo) => <option key={metodo} value={metodo}>{metodo}</option>)}
                    </select>
                  </div>
                </div>
                <Alerta tipo="danger">{error}</Alerta>
                <button className="btn btn-mil-sabores btn-lg w-100 mt-3" type="submit" disabled={procesando}>
                  {procesando ? "Procesando pedido…" : "Confirmar y pagar"}
                </button>
              </form>
            </div>

            <aside className="col-lg-5">
              <div className="card-producto p-4 sombra-suave">
                <h2 className="h4 mb-3">Resumen del pedido</h2>
                {resumen.lineas.map((linea) => (
                  <div className="d-flex justify-content-between gap-3 mb-2" key={linea.codigo}>
                    <span>{linea.nombre} × {linea.cantidad}</span>
                    <span>{formatoPesos(linea.subtotal)}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold">
                  <span>Total</span><span>{formatoPesos(resumen.total)}</span>
                </div>
                <Link className="btn btn-outline-mil-sabores w-100 mt-3" to="/carrito">Volver al carrito</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
