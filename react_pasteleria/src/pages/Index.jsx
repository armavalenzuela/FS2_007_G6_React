import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ProductList from '../components/organisms/ProductList'
import productos from '../data/Productos'
import categorias from '../data/Categorias'

function Index() {
  const destacados = productos.filter((p) => p.destacado)

  return (
    <Container className="my-4">
      <h1 className="mb-4">Nuestros productos</h1>

      <h2 className="mb-3">Categorías</h2>
      <Row className="g-3 mb-5">
        {categorias.map((cat) => (
          <Col key={cat.id} xs={6} md={4} lg={3}>
            <Link to="/catalogo" className="text-decoration-none text-dark">
              <div className="border rounded p-3 text-center h-100 bg-light">
                <div className="fw-bold">{cat.nombre}</div>
                <div className="text-muted small">{cat.descripcion}</div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>

      <h2 className="mb-3">Productos destacados</h2>
      <ProductList productos={destacados} />

      <div className="text-center mt-4">
        <Button as={Link} to="/catalogo" variant="dark" size="lg">
          Ver catálogo completo
        </Button>
      </div>
    </Container>
  )
}

export default Index
