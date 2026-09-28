import { useState } from 'react'
import { Card, Button } from 'react-bootstrap'

function ProductCard({ nombre, precio, imagen }) {
  const [favorito, setFavorito] = useState(false)

  return (
    <Card className="h-100">
      {imagen && <Card.Img variant="top" src={imagen} alt={nombre} />}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{nombre}</Card.Title>
        <Card.Text>${precio.toLocaleString('es-CL')}</Card.Text>
        <Button
          className="mt-auto"
          variant={favorito ? 'warning' : 'outline-secondary'}
          onClick={() => setFavorito(!favorito)}
        >
          {favorito ? '★ Favorito' : '☆ Favorito'}
        </Button>
      </Card.Body>
    </Card>
  )
}

export default ProductCard