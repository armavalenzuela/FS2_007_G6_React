<<<<<<< HEAD
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
=======
import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useColeccion } from "../hooks/useColeccion.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { calcularTotales, validarStock } from "../data/reglasNegocio.js";
import { validarDireccion } from "../utils/validaciones.js";
import { formatoPesos } from "../utils/formato.js";
import { METODOS_PAGO, procesarPago } from "../services/pagos.js";
import { registrarPedido } from "../services/pedidos.js";
import { REGIONES } from "../data/regiones.js";
import Alerta from "../components/Alerta.jsx";
import { CLAVE_ULTIMO_PEDIDO } from "./Pedido.jsx";

const HORARIOS = ["Mañana (9:00 - 13:00)", "Tarde (14:00 - 18:00)", "Noche (18:00 - 21:00)"];
>>>>>>> origin/dev/Cristopher

export default function Checkout() {
  const productos = useColeccion("productos");
  const { items, vaciar } = useCarrito();
  const { usuario } = useSesion();
  const navegar = useNavigate();
<<<<<<< HEAD
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
=======

  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellidos: "",
    correo: usuario?.correo || "",
    telefono: usuario?.telefono || "",
    calle: "",
    departamento: "",
    region: "Región Metropolitana de Santiago",
    comuna: "",
    indicaciones: "",
    fechaEntrega: "",
    horario: HORARIOS[0],
    metodoPago: METODOS_PAGO[0],
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [procesando, setProcesando] = useState(false);

  const resumen = useMemo(() => calcularTotales(items, productos, usuario), [items, productos, usuario]);
  const comunas = REGIONES.find((r) => r.nombre === form.region)?.comunas || [];

  function cambiar(e) {
    const { name, value } = e.target;
    setForm((anterior) => ({ ...anterior, [name]: value, ...(name === "region" ? { comuna: "" } : {}) }));
  }

  async function pagar(e) {
    e.preventDefault();
    setErrorGeneral("");
    if (items.length === 0) {
      setErrorGeneral("Tu carrito está vacío, agrega productos antes de continuar.");
      return;
    }
    const nuevosErrores = validarDireccion(form);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const problemas = validarStock(items, productos);
    if (problemas.length > 0) {
      setErrorGeneral(`${problemas[0].motivo}. Revisa tu carrito antes de pagar.`);
>>>>>>> origin/dev/Cristopher
      return;
    }

    setProcesando(true);
    try {
<<<<<<< HEAD
      const pago = await procesarPago({ total: resumen.total, metodo: metodoPago });
      if (!pago.aprobado) {
        setError("El pago fue rechazado. Selecciona otro método de pago e inténtalo nuevamente.");
=======
      const respuesta = await procesarPago({ total: resumen.total, metodo: form.metodoPago });
      if (!respuesta.aprobado) {
        navegar("/pago-fallido", { state: { total: resumen.total } });
>>>>>>> origin/dev/Cristopher
        return;
      }

      const pedido = registrarPedido({
        items,
<<<<<<< HEAD
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
=======
        resumen,
        usuario,
        metodoPago: form.metodoPago,
        codigoAutorizacion: respuesta.codigoAutorizacion,
        datosEnvio: { ...form },
      });
      sessionStorage.setItem(CLAVE_ULTIMO_PEDIDO, pedido.numero);
      vaciar();
      navegar(`/pedido/${pedido.numero}`);
    } catch (error) {
      setErrorGeneral(error.message || "No se pudo registrar el pedido, intenta nuevamente.");
>>>>>>> origin/dev/Cristopher
    } finally {
      setProcesando(false);
    }
  }

<<<<<<< HEAD
  if (items.length === 0) {
    return (
      <section className="seccion">
        <div className="container text-center">
          <h1>Tu carrito está vacío</h1>
          <Link className="btn btn-mil-sabores mt-3" to="/catalogo">Volver al catálogo</Link>
=======
  const clase = (campo) => `form-control ${errores[campo] ? "is-invalid" : ""}`;
  const feedback = (campo) => <div className="invalid-feedback">{errores[campo]}</div>;

  if (items.length === 0) {
    return (
      <section className="seccion text-center">
        <div className="container">
          <h2>Tu carrito está vacío</h2>
          <Link to="/catalogo" className="btn btn-mil-sabores mt-3">Ir al catálogo</Link>
>>>>>>> origin/dev/Cristopher
        </div>
      </section>
    );
  }

  return (
    <>
      <header className="hero-mil-sabores py-4">
<<<<<<< HEAD
        <div className="container"><h1 className="mb-0">Finalizar pedido</h1></div>
      </header>
=======
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h1 className="mb-0">Finalizar compra</h1>
          <Link to="/carrito" className="btn btn-outline-mil-sabores btn-sm">Volver al carrito</Link>
        </div>
      </header>

>>>>>>> origin/dev/Cristopher
      <section className="seccion">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
<<<<<<< HEAD
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
=======
              <form className="form-mil-sabores card-producto p-4" onSubmit={pagar} noValidate>
                <h5 className="mb-3">Datos del cliente</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="chkNombre">Nombre</label>
                    <input id="chkNombre" name="nombre" className={clase("nombre")} value={form.nombre} onChange={cambiar} />
                    {feedback("nombre")}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="chkApellidos">Apellidos</label>
                    <input id="chkApellidos" name="apellidos" className={clase("apellidos")} value={form.apellidos} onChange={cambiar} />
                    {feedback("apellidos")}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="chkCorreo">Correo</label>
                    <input id="chkCorreo" name="correo" type="email" className={clase("correo")} value={form.correo} onChange={cambiar} />
                    {feedback("correo")}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="chkTelefono">Teléfono <span className="texto-secundario">(opcional)</span></label>
                    <input id="chkTelefono" name="telefono" type="tel" className="form-control" value={form.telefono} onChange={cambiar} />
                  </div>
                </div>

                <h5 className="mt-4 mb-1">Dirección de entrega</h5>
                <p className="small texto-secundario">Ingresa la dirección de forma detallada.</p>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label" htmlFor="chkCalle">Calle y número</label>
                    <input id="chkCalle" name="calle" className={clase("calle")} value={form.calle} onChange={cambiar} />
                    {feedback("calle")}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="chkDepto">Departamento <span className="texto-secundario">(opcional)</span></label>
                    <input id="chkDepto" name="departamento" className="form-control" placeholder="Ej: 603" value={form.departamento} onChange={cambiar} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="chkRegion">Región</label>
                    <select id="chkRegion" name="region" className={`form-select ${errores.region ? "is-invalid" : ""}`} value={form.region} onChange={cambiar}>
                      <option value="">Selecciona una región</option>
                      {REGIONES.map((r) => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
                    </select>
                    {feedback("region")}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="chkComuna">Comuna</label>
                    <select id="chkComuna" name="comuna" className={`form-select ${errores.comuna ? "is-invalid" : ""}`} value={form.comuna} onChange={cambiar}>
                      <option value="">Selecciona una comuna</option>
                      {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {feedback("comuna")}
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="chkIndicaciones">Indicaciones para la entrega <span className="texto-secundario">(opcional)</span></label>
                    <textarea id="chkIndicaciones" name="indicaciones" rows="2" className="form-control"
                      placeholder="Ej: Entre calles, color del edificio, no tiene timbre." value={form.indicaciones} onChange={cambiar} />
                  </div>
                </div>

                <h5 className="mt-4 mb-3">Opciones de entrega y pago</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="chkFecha">Fecha de entrega preferida</label>
                    <input id="chkFecha" name="fechaEntrega" type="date" className={clase("fechaEntrega")} value={form.fechaEntrega} onChange={cambiar} />
                    {feedback("fechaEntrega")}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="chkHorario">Horario preferido</label>
                    <select id="chkHorario" name="horario" className="form-select" value={form.horario} onChange={cambiar}>
                      {HORARIOS.map((h) => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="chkPago">Método de pago</label>
                    <select id="chkPago" name="metodoPago" className="form-select" value={form.metodoPago} onChange={cambiar}>
                      {METODOS_PAGO.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <Alerta tipo="danger">{errorGeneral}</Alerta>
                <button type="submit" className="btn btn-mil-sabores btn-lg w-100 mt-4" disabled={procesando}>
                  {procesando ? "Procesando pago..." : `Pagar ahora ${formatoPesos(resumen.total)}`}
>>>>>>> origin/dev/Cristopher
                </button>
              </form>
            </div>

<<<<<<< HEAD
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
=======
            <div className="col-lg-5">
              <div className="card-producto p-4 sombra-suave">
                <h5 className="mb-3">Resumen</h5>
                {resumen.lineas.map((l) => (
                  <div key={l.codigo} className="d-flex justify-content-between small mb-1">
                    <span>{l.cantidad} x {l.nombre}</span><span>{formatoPesos(l.subtotal)}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>{formatoPesos(resumen.subtotal)}</span></div>
                {resumen.totalDescuentos > 0 && (
                  <div className="d-flex justify-content-between mb-2 texto-secundario"><span>Descuentos</span><span>-{formatoPesos(resumen.totalDescuentos)}</span></div>
                )}
                <div className="d-flex justify-content-between mb-2"><span>Envío</span><span>Gratis</span></div>
                <hr />
                <div className="d-flex justify-content-between fs-5 fw-bold"><span>Total</span><span>{formatoPesos(resumen.total)}</span></div>
              </div>
              {usuario && <p className="small texto-secundario mt-2">Tus datos se completaron desde tu cuenta.</p>}
            </div>
>>>>>>> origin/dev/Cristopher
          </div>
        </div>
      </section>
    </>
  );
}
