import { Route, Routes } from "react-router-dom";
import Blog, { BlogDetalle } from "./pages/Blog.jsx";
import Carrito from "./pages/Cart.jsx";
import Catalogo from "./pages/Catalog.jsx";
import Checkout from "./pages/Checkout.jsx";
import Contacto from "./pages/Contact.jsx";
import Home from "./pages/Index.jsx";
import Login from "./pages/Login.jsx";
import MiCuenta from "./pages/MyAcount.jsx";
import NoEncontrado from "./pages/NoFound.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Ofertas from "./pages/Ofertas.jsx";
import Pedido from "./pages/Pedido.jsx";
import DetalleProducto from "./pages/ProducDetail.jsx";
import Registro from "./pages/Registro.jsx";
import Layout from "./components/organisms/Layout.jsx";
import ProtectedRoute from "./components/organisms/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="producto/:codigo" element={<DetalleProducto />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetalle />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route
          path="mi-cuenta"
          element={
            <ProtectedRoute>
              <MiCuenta />
            </ProtectedRoute>
          }
        />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pedido/:numero" element={<Pedido />} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}

export default App;
