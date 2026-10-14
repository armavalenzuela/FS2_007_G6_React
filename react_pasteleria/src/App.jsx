import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Ofertas from "./pages/Ofertas.jsx";
import DetalleProducto from "./pages/DetalleProducto.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import { Blog, BlogDetalle } from "./pages/Blog.jsx";
import Contacto from "./pages/Contacto.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import MiCuenta from "./pages/MiCuenta.jsx";
import Carrito from "./pages/Carrito.jsx";
import Checkout from "./pages/Checkout.jsx";
import Pedido from "./pages/Pedido.jsx";
import PagoFallido from "./pages/PagoFallido.jsx";
import NoEncontrado from "./pages/NoEncontrado.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminProductos from "./pages/admin/AdminProductos.jsx";
import AdminProductoForm from "./pages/admin/AdminProductoForm.jsx";
import AdminUsuarios from "./pages/admin/AdminUsuarios.jsx";
import { AdminPedidos, HistorialUsuario } from "./pages/admin/AdminPedidos.jsx";

function SoloAdmin({ children }) {
  return <ProtectedRoute roles={["administrador"]}>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="producto/:codigo" element={<DetalleProducto />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetalle />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pedido/:numero" element={<Pedido />} />
        <Route path="pago-fallido" element={<PagoFallido />} />
        <Route path="mi-cuenta" element={<ProtectedRoute roles={["cliente"]}><MiCuenta /></ProtectedRoute>} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<SoloAdmin><Dashboard /></SoloAdmin>} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="productos/nuevo" element={<AdminProductoForm />} />
        <Route path="productos/:codigo/editar" element={<AdminProductoForm />} />
        <Route path="usuarios" element={<SoloAdmin><AdminUsuarios /></SoloAdmin>} />
        <Route path="usuarios/:correo/historial" element={<SoloAdmin><HistorialUsuario /></SoloAdmin>} />
        <Route path="pedidos" element={<SoloAdmin><AdminPedidos /></SoloAdmin>} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
