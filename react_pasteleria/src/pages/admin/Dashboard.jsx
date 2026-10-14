import { Link } from "react-router-dom";
import { useColeccion } from "../../hooks/useColeccion.js";
import { esStockCritico } from "../../data/reglasNegocio.js";
import { formatoPesos } from "../../utils/formato.js";

// Panel de inicio del administrador con métricas calculadas desde la base de datos
export default function Dashboard() {
  const productos = useColeccion("productos");
  const usuarios = useColeccion("usuarios");
  const pedidos = useColeccion("pedidos");
  const criticos = productos.filter(esStockCritico);
  const ventas = pedidos.reduce((suma, p) => suma + p.total, 0);

  const tarjetas = [
    { titulo: "Ventas", valor: formatoPesos(ventas), detalle: `${pedidos.length} pedidos`, color: "primary" },
    { titulo: "Productos", valor: productos.length, detalle: `${criticos.length} con stock crítico`, color: "success" },
    { titulo: "Usuarios", valor: usuarios.length, detalle: "cuentas registradas", color: "warning" },
  ];

  return (
    <>
      <h1>¡Hola, Administrador!</h1>
      <p className="texto-secundario">Desde aquí puedes gestionar los productos, usuarios y pedidos de Pastelería Mil Sabores.</p>

      <div className="row g-4 mt-2">
        {tarjetas.map((t) => (
          <div className="col-md-4" key={t.titulo}>
            <div className={`p-4 rounded-3 text-white bg-${t.color}`}>
              <p className="mb-1 small">{t.titulo}</p>
              <p className="fs-3 fw-bold mb-1">{t.valor}</p>
              <p className="mb-0 small">{t.detalle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mt-1">
        <div className="col-md-6">
          <div className="card-producto p-4 h-100">
            <h5>Productos</h5>
            <p className="texto-secundario">Revisa el catálogo, agrega productos y controla el stock crítico.</p>
            <Link to="/admin/productos" className="btn btn-mil-sabores">Ver productos</Link>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-producto p-4 h-100">
            <h5>Usuarios</h5>
            <p className="texto-secundario">Revisa las cuentas registradas en la tienda.</p>
            <Link to="/admin/usuarios" className="btn btn-mil-sabores">Ver usuarios</Link>
          </div>
        </div>
      </div>
    </>
  );
}
