import { Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import AppNavbar from './components/organisms/NavBar'
import ProductList from './components/organisms/ProductList'
import productos from './data/Productos'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Perfil from './pages/Perfil'
import Checkout from './pages/Checkout'
import Pedidos from './pages/Pedidos'
import PedidoDetalle from './pages/PedidoDetalle'

function Home() {
  return (
    <Container className="my-4">
      <h1>Nuestros productos</h1>
      <ProductList productos={productos.slice(0, 6)} />
    </Container>
  )
}

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/producto/:id" element={<Product />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/pedidos/:id" element={<PedidoDetalle />} />
      </Routes>
    </>
  )
}

export default App
