import { Container } from 'react-bootstrap'
import AppNavbar from './components/organisms/NavBar'
import ProductList from './components/organisms/ProductList'
import productos from './data/Products'

function App() {
  return (
    <>
      <AppNavbar />
      <Container className="my-4">
        <h1>Nuestros productos</h1>
        <ProductList productos={productos} />
      </Container>
    </>
  )
}

export default App