import { Link, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Carrito from "./pages/Carrito.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Checkout from "./pages/Checkout.jsx";
import Contacto from "./pages/Contacto.jsx";
import DetalleProducto from "./pages/DetalleProducto.jsx";
import Home from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import MiCuenta from "./pages/MiCuenta.jsx";
import Ofertas from "./pages/Ofertas.jsx";
import Pedido from "./pages/Pedido.jsx";
import Registro from "./pages/Registro.jsx";

function NoEncontrado() {
  return (
    <section className="container py-5 text-center">
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe.</p>
    </section>
  );
}

function PagoFallido() {
  return (
    <section className="container py-5 text-center">
      <h1>No se pudo completar el pago</h1>
      <p>Tu carrito sigue guardado. Puedes volver a intentarlo o revisar tus productos.</p>
      <Link to="/checkout" className="btn btn-primary me-2">Intentar nuevamente</Link>
      <Link to="/carrito" className="btn btn-outline-secondary">Volver al carrito</Link>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="producto/:codigo" element={<DetalleProducto />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pago-fallido" element={<PagoFallido />} />
        <Route path="pedido/:numero" element={<Pedido />} />
        <Route
          path="mi-cuenta"
          element={
            <ProtectedRoute roles={["cliente"]}>
              <MiCuenta />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
