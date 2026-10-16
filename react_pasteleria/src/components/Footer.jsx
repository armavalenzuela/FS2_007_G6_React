import { Link } from "react-router-dom";

export default function Footer() {
  const anio = new Date().getFullYear();
  return (
    <footer className="footer-mil-sabores">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h6>Pastelería Mil Sabores</h6>
            <p className="mb-0">50 años endulzando momentos en Chile.</p>
          </div>
          <div className="col-md-4">
            <h6>Enlaces</h6>
            <ul className="list-unstyled">
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/ofertas">Ofertas</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6>Síguenos</h6>
            <div className="d-flex gap-3 fs-6">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
            </div>
          </div>
        </div>
        <hr className="border-light opacity-25" />
        <p className="text-center mb-0 small">{anio} Pastelería Mil Sabores. FullStack II Grupo6.</p>
      </div>
    </footer>
  );
}
