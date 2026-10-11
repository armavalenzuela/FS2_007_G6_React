import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useColeccion } from "../hooks/useColeccion.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Alerta from "../components/Alerta.jsx";
import { filtrarProductos, categoriasUnicas } from "../utils/filtros.js";

// Catálogo con filtros. Lee ?q= (buscador del navbar) y ?categoria= (accesos rápidos)
export default function Catalogo() {
  const productos = useColeccion("productos");
  const { agregar } = useCarrito();
  const [params] = useSearchParams();
  const [filtros, setFiltros] = useState({
    texto: params.get("q") || "",
    categoria: params.get("categoria") || "",
    orden: "",
  });
  const [aviso, setAviso] = useState(null);

  // Si cambia la URL (p. ej. buscador del navbar estando ya en el catálogo), se actualizan los filtros
  useEffect(() => {
    setFiltros((anterior) => ({ ...anterior, texto: params.get("q") || "", categoria: params.get("categoria") || "" }));
  }, [params]);

  const resultado = useMemo(() => filtrarProductos(productos, filtros), [productos, filtros]);

  function cambiar(campo) {
    return (evento) => setFiltros({ ...filtros, [campo]: evento.target.value });
  }

  function limpiar() {
    setFiltros({ texto: "", categoria: "", orden: "" });
  }

  function añadir(codigo) {
    const r = agregar(codigo, 1);
    setAviso({ tipo: r.ok ? "success" : "danger", texto: r.mensaje });
  }

  return (
    <>
      <header className="hero-mil-sabores py-4">
        <div className="container"><h1 className="mb-0">Catálogo de productos</h1></div>
      </header>

      <section className="seccion">
        <div className="container">
          <div className="row">
            <aside className="col-lg-3 mb-4">
              <div className="card-producto p-3 sombra-suave">
                <h6 className="mb-2">Buscar</h6>
                <input type="search" className="form-control mb-4" placeholder="Ej: chocolate, torta..."
                  value={filtros.texto} onChange={cambiar("texto")} />

                <h6 className="mb-2">Categoría</h6>
                <select className="form-select mb-4" value={filtros.categoria} onChange={cambiar("categoria")}>
                  <option value="">Todas las categorías</option>
                  {categoriasUnicas(productos).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                <h6 className="mb-2">Ordenar por precio</h6>
                <select className="form-select mb-4" value={filtros.orden} onChange={cambiar("orden")}>
                  <option value="">Relevancia</option>
                  <option value="asc">Menor a mayor</option>
                  <option value="desc">Mayor a menor</option>
                </select>

                <button className="btn btn-outline-mil-sabores w-100" onClick={limpiar}>Limpiar filtros</button>
              </div>
            </aside>

            <div className="col-lg-9">
              <p className="texto-secundario">{resultado.length} productos encontrados</p>
              <Alerta tipo={aviso?.tipo}>{aviso?.texto}</Alerta>
              <div className="row g-4 mt-1">
                {resultado.map((p) => (
                  <div className="col-6 col-md-4" key={p.codigo}>
                    <ProductCard producto={p} onAgregar={añadir} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
