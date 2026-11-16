import { Link, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
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
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminProductos from "./pages/admin/AdminProductos.jsx";
import AdminProductoForm from "./pages/admin/AdminProductoForm.jsx";
import AdminUsuarios from "./pages/admin/AdminUsuarios.jsx";
import { AdminPedidos, HistorialUsuario } from "./pages/admin/AdminPedidos.jsx";

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

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<ProtectedRoute roles={["administrador"]}><Dashboard /></ProtectedRoute>} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="productos/nuevo" element={<AdminProductoForm />} />
        <Route path="productos/:codigo/editar" element={<AdminProductoForm />} />
        <Route path="usuarios" element={<ProtectedRoute roles={["administrador"]}><AdminUsuarios /></ProtectedRoute>} />
        <Route path="usuarios/:correo/historial" element={<ProtectedRoute roles={["administrador"]}><HistorialUsuario /></ProtectedRoute>} />
        <Route path="pedidos" element={<ProtectedRoute roles={["administrador"]}><AdminPedidos /></ProtectedRoute>} />
      </Route>
    </Routes >
  );
}
