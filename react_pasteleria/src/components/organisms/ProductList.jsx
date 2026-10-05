import { Row, Col } from 'react-bootstrap'
import ProductCard from '../molecules/ProductCard'

function ProductList({ productos }) {
  return (
    <Row className="g-3">
      {productos.map((p) => (
        <Col key={p.id} xs={12} md={6} lg={4}>
          <ProductCard
            id={p.id}
            nombre={p.nombre}
            precio={p.precio}
            imagen={p.imagen}
            categoria={p.categoria}
            tamañoBase={p.tamañoBase}
          />
        </Col>
      ))}
    </Row>
  )
}

export default ProductList