import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { crear, actualizar, obtener } from "../../data/baseDatos.js";
import { CATEGORIAS_PRODUCTO, TIPO_POR_CATEGORIA } from "../../data/catalogos.js";

// OJO: en tu proyecto las imágenes se sirven desde /img/productos/ (publicDir: "assets")
const FORMATO_IMAGEN = (codigo) => `/img/productos/${codigo}.jpg`;

// Crea o edita un producto. Sin :codigo => crear; con :codigo => editar.
export default function AdminProductoForm() {
  const { codigo } = useParams();
  const navegar = useNavigate();
  const editando = Boolean(codigo);
  const original = editando ? obtener("productos", codigo) : null;

  const [form, setForm] = useState(original || {
    codigo: "", nombre: "", descripcion: "", precio: "", stock: "", stockCritico: "",
    categoria: "", tipo: "tradicional", enOferta: false, descuentoOferta: 0,
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  if (editando && !original) return <p>No existe el producto solicitado. <Link to="/admin/productos">Volver</Link></p>;

  function cambiar(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function validar() {
    const e = {};
    if (!editando && form.codigo.trim().length < 3) e.codigo = "El código es requerido (mínimo 3 caracteres).";
    if (!form.nombre.trim() || form.nombre.length > 100) e.nombre = "El nombre es requerido (máximo 100 caracteres).";
    if (form.precio === "" || Number(form.precio) < 0) e.precio = "Ingresa un precio válido (mínimo 0).";
    if (form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) e.stock = "Ingresa un stock válido (entero, mínimo 0).";
    if (form.stockCritico !== "" && (!Number.isInteger(Number(form.stockCritico)) || Number(form.stockCritico) < 0)) e.stockCritico = "Debe ser un número entero, mínimo 0.";
    if (!form.categoria) e.categoria = "Selecciona una categoría.";
    if (form.enOferta && (Number(form.descuentoOferta) <= 0 || Number(form.descuentoOferta) >= 100)) e.descuentoOferta = "El descuento debe estar entre 1 y 99%.";
    return e;
  }

  function guardar(e) {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    setErrorGeneral("");
    if (Object.keys(nuevosErrores).length > 0) return;

    const datos = {
      ...form,
      codigo: editando ? codigo : form.codigo.trim().toUpperCase(),
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      stockCritico: form.stockCritico === "" ? 0 : Number(form.stockCritico),
      descuentoOferta: form.enOferta ? Number(form.descuentoOferta) : 0,
      tipo: TIPO_POR_CATEGORIA[form.categoria] || "tradicional",
      imagen: FORMATO_IMAGEN(editando ? codigo : form.codigo.trim().toUpperCase()),
    };
    try {
      if (editando) actualizar("productos", codigo, datos);
      else crear("productos", datos);
      navegar("/admin/productos");
    } catch (error) {
      setErrorGeneral(error.message);
    }
  }

  const clase = (campo) => `form-control ${errores[campo] ? "is-invalid" : ""}`;
  const fb = (campo) => <div className="invalid-feedback">{errores[campo]}</div>;

  return (
    <>
      <p><Link to="/admin/productos">← Volver al listado</Link></p>
      <h1>{editando ? "Editar producto" : "Nuevo producto"}</h1>
      <div className="card-producto p-4" style={{ maxWidth: 640 }}>
        <form className="form-mil-sabores" onSubmit={guardar} noValidate>
          <div className="mb-3">
            <label className="form-label" htmlFor="prodCodigo">Código</label>
            <input id="prodCodigo" name="codigo" className={clase("codigo")} value={editando ? codigo : form.codigo}
              disabled={editando} onChange={cambiar} />
            {fb("codigo")}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="prodNombre">Nombre</label>
            <input id="prodNombre" name="nombre" className={clase("nombre")} value={form.nombre} onChange={cambiar} maxLength={100} />
            {fb("nombre")}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="prodDescripcion">Descripción <span className="texto-secundario">(opcional)</span></label>
            <textarea id="prodDescripcion" name="descripcion" rows="3" className="form-control" value={form.descripcion} onChange={cambiar} maxLength={500} />
          </div>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="prodPrecio">Precio</label>
              <input id="prodPrecio" name="precio" type="number" min="0" step="1" className={clase("precio")} value={form.precio} onChange={cambiar} />
              {fb("precio")}
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="prodStock">Stock</label>
              <input id="prodStock" name="stock" type="number" min="0" step="1" className={clase("stock")} value={form.stock} onChange={cambiar} />
              {fb("stock")}
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="prodStockCritico">Stock crítico <span className="texto-secundario">(opcional)</span></label>
              <input id="prodStockCritico" name="stockCritico" type="number" min="0" step="1" className={clase("stockCritico")} value={form.stockCritico} onChange={cambiar} />
              {fb("stockCritico")}
            </div>
          </div>
          <div className="mb-3 mt-3">
            <label className="form-label" htmlFor="prodCategoria">Categoría</label>
            <select id="prodCategoria" name="categoria" className={`form-select ${errores.categoria ? "is-invalid" : ""}`} value={form.categoria} onChange={cambiar}>
              <option value="">-- Selecciona una categoría --</option>
              {CATEGORIAS_PRODUCTO.map((c) => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
            </select>
            {fb("categoria")}
          </div>
          <div className="mb-3 form-check">
            <input id="prodOferta" name="enOferta" type="checkbox" className="form-check-input" checked={form.enOferta} onChange={cambiar} />
            <label className="form-check-label" htmlFor="prodOferta">Producto en oferta</label>
          </div>
          {form.enOferta && (
            <div className="mb-3">
              <label className="form-label" htmlFor="prodDescuento">Porcentaje de descuento</label>
              <input id="prodDescuento" name="descuentoOferta" type="number" min="1" max="99" className={clase("descuentoOferta")} value={form.descuentoOferta} onChange={cambiar} />
              {fb("descuentoOferta")}
            </div>
          )}
          <p className="small texto-secundario">La imagen se toma automáticamente de <code>assets/img/productos/&lt;código&gt;.jpg</code>.</p>
          {errorGeneral && <div className="alert alert-danger small">{errorGeneral}</div>}
          <button type="submit" className="btn btn-mil-sabores w-100">Guardar producto</button>
        </form>
      </div>
    </>
  );
}