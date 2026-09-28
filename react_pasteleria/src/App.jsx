import { Container } from 'react-bootstrap'
import AppNavbar from './components/organisms/Navbar'
import productos from './data/productos'

function App() {
  return (
    <>
      <AppNavbar />
      <Container className="my-4">
        <h1>Nuestros productos</h1>
        <ShoppingCart cantidad={0} />
        <ProductList productos={productos} />
      </Container>
    </>
  )
}

export default App