import { Link } from "react-router-dom";

export default function NoEncontrado() {
  return (
    <section className="seccion text-center">
      <div className="container">
        <h1>Página no encontrada</h1>
        <p className="texto-secundario">La página que buscas no existe.</p>
        <Link to="/" className="btn btn-mil-sabores">Volver al inicio</Link>
      </div>
    </section>
  );
}
