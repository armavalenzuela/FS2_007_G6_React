import { Link } from "react-router-dom";
import { useColeccion } from "../utils/useColeccion.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import ProductCard from "../components/molecules/ProductCard.jsx";
import Alerta from "../components/organisms/Alerta.jsx";
import { useState } from "react";

const CATEGORIAS_RAPIDAS = [
  { nombre: "Tortas Cuadradas", etiqueta: "Tortas Cuadradas" },
  { nombre: "Tortas Circulares", etiqueta: "Tortas Circulares" },
  { nombre: "Productos Vegana", etiqueta: "Línea Vegana" },
  { nombre: "Tortas Especiales", etiqueta: "Tortas Especiales" },
];

export default function Home() {
  const productos = useColeccion("productos");
  const { agregar } = useCarrito();
  const [aviso, setAviso] = useState(null);

  function añadir(codigo) {
    const resultado = agregar(codigo, 1);
    setAviso({ tipo: resultado.ok ? "success" : "danger", texto: resultado.mensaje });
  }

  return (
    <>
      <header className="hero-mil-sabores">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="chip-categoria mb-3 d-inline-block">50 años endulzando tu vida</span>
              <h1>Celebrando la dulzura de la vida desde 1975</h1>
              <p className="fs-5">Pastelería Mil Sabores referente de la repostería chilena: participamos en el récord
                Guinness de 1995 a la torta más grande del mundo, y hoy trabajamos para llevar esa tradición directo a tu puerta.</p>
              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link to="/catalogo" className="btn btn-mil-sabores btn-lg px-4">Ver catálogo</Link>
                <Link to="/registro" className="btn btn-outline-mil-sabores btn-lg px-4">Crear cuenta y obtener descuentos</Link>
              </div>
            </div>
            <div className="col-lg-5 text-center">
              <img src="/assets/img/Logo_sinfondo.png" alt="Logotipo de Pastelería Mil Sabores" className="img-fluid mb-3" style={{ maxHeight: 140 }} />
              <p className="titulo-cursivo fs-2 mb-1">Récord Guinness 1995</p>
              <p className="mb-0">Colaboramos en la creación de la torta más grande del mundo, un hito que sigue inspirando cada receta que sale de nuestro obrador.</p>
            </div>
          </div>
        </div>
      </header>

      <section className="seccion">
        <div className="container">
          <h2 className="text-center mb-4">Explora por categoría</h2>
          <div className="row g-3">
            {CATEGORIAS_RAPIDAS.map((cat) => (
              <div className="col-6 col-md-3" key={cat.nombre}>
                <Link to={`/catalogo?categoria=${encodeURIComponent(cat.nombre)}`} className="text-decoration-none">
                  <div className="card-producto text-center p-3">
                    <div className="icono-redondo"></div>
                    <h6>{cat.etiqueta}</h6>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="seccion seccion-alterna">
        <div className="container">
          <h2 className="text-center mb-4">Productos destacados</h2>
          <Alerta tipo={aviso?.tipo}>{aviso?.texto}</Alerta>
          <div className="row g-4 mt-1">
            {productos.slice(0, 4).map((p) => (
              <div className="col-6 col-lg-3" key={p.codigo}>
                <ProductCard producto={p} onAgregar={añadir} />
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/catalogo" className="btn btn-rosa btn-lg">Ver catálogo completo</Link>
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="container">
          <div className="row g-4 text-center justify-content-center">
            <div className="col-md-6">
              <div className="icono-redondo"></div>
              <h5>Misión</h5>
              <p className="texto-secundario">Ofrecer una experiencia dulce y memorable, con productos de alta calidad para todas las ocasiones, celebrando nuestras raíces históricas.</p>
            </div>
            <div className="col-md-6">
              <div className="icono-redondo"></div>
              <h5>Visión</h5>
              <p className="texto-secundario">Ser la tienda online líder de repostería en Chile, reconocida por innovar, por su calidad e impacto en la comunidad gastronómica.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
