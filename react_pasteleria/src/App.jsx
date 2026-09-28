import { Container } from 'react-bootstrap'
import ProductCard from './components/ProductCard'

function App() {
  return (
    <Container className="mt-4">
      <h1>Catalogo</h1>
      <ProductCard nombre="Torta de chocolate" precio={18990} />
      <ProductCard nombre="Cheesecake de frambuesa" precio={16990} />
    </Container>
  )
}

export default App