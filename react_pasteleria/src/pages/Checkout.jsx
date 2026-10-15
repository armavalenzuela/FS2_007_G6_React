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

export default function Checkout() {
  const productos = useColeccion("productos");
  const { items, vaciar } = useCarrito();
  const { usuario } = useSesion();
  const navegar = useNavigate();

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
      return;
    }

    setProcesando(true);
    try {
      const respuesta = await procesarPago({ total: resumen.total, metodo: form.metodoPago });
      if (!respuesta.aprobado) {
        navegar("/pago-fallido", { state: { total: resumen.total } });
        return;
      }

      const pedido = registrarPedido({
        items,
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
    } finally {
      setProcesando(false);
    }
  }

  const clase = (campo) => `form-control ${errores[campo] ? "is-invalid" : ""}`;
  const feedback = (campo) => <div className="invalid-feedback">{errores[campo]}</div>;

  if (items.length === 0) {
    return (
      <section className="seccion text-center">
        <div className="container">
          <h2>Tu carrito está vacío</h2>
          <Link to="/catalogo" className="btn btn-mil-sabores mt-3">Ir al catálogo</Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <header className="hero-mil-sabores py-4">
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h1 className="mb-0">Finalizar compra</h1>
          <Link to="/carrito" className="btn btn-outline-mil-sabores btn-sm">Volver al carrito</Link>
        </div>
      </header>

      <section className="seccion">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-7">
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
                </button>
              </form>
            </div>

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
          </div>
        </div>
      </section>
    </>
  );
}
