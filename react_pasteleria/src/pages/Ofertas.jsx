import { useColeccion } from "../hooks/useColeccion.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Alerta from "../components/Alerta.jsx";
import { useState } from "react";

// Nueva vista: muestra solo los productos que están en oferta
export default function Ofertas() {
  const productos = useColeccion("productos");
  const { agregar } = useCarrito();
  const [aviso, setAviso] = useState(null);
  const enOferta = productos.filter((p) => p.enOferta && p.descuentoOferta > 0);

  function añadir(codigo) {
    const r = agregar(codigo, 1);
    setAviso({ tipo: r.ok ? "success" : "danger", texto: r.mensaje });
  }

  return (
    <>
      <header className="hero-mil-sabores py-4">
        <div className="container"><h1 className="mb-0">Ofertas</h1></div>
      </header>
      <section className="seccion">
        <div className="container">
          {enOferta.length === 0 ? (
            <p className="texto-secundario">Por ahora no hay productos en oferta. ¡Vuelve pronto!</p>
          ) : (
            <>
              <Alerta tipo={aviso?.tipo}>{aviso?.texto}</Alerta>
              <div className="row g-4 mt-1">
                {enOferta.map((p) => (
                  <div className="col-6 col-md-4 col-lg-3" key={p.codigo}>
                    <ProductCard producto={p} onAgregar={añadir} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
