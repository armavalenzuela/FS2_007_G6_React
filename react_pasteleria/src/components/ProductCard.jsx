import { useState } from 'react'
import { Card, Button } from 'react-bootstrap'

function ProductCard({ nombre, precio }) {
  const [cantidad, setCantidad] = useState(0)

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{nombre}</Card.Title>
        <Card.Text>Precio: ${precio.toLocaleString('es-CL')}</Card.Text>
        <Card.Text>Cantidad: {cantidad}</Card.Text>
        <Button onClick={() => setCantidad(cantidad + 1)}>Agregar</Button>
      </Card.Body>
    </Card>
  )
}

export default ProductCard