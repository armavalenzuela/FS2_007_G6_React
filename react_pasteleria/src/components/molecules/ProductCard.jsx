import { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { useCart } from '../../context/CartContext'

function ProductCard({ id, nombre, precio, imagen, categoria, tamañoBase }) {
  const { addItem, toggleFavorito, esFavorito } = useCart()
  const [agregado, setAgregado] = useState(false)
  const favorito = esFavorito(id)

  function manejarAgregar() {
    addItem(
      { id, nombre, categoria },
      { tamaño: tamañoBase || 'Mediano', precioUnitario: precio },
    )
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  return (
    <Card className="h-100">
      {imagen && <Card.Img variant="top" src={imagen} alt={nombre} />}
      <Card.Body className="d-flex flex-column">
        <Card.Title>{nombre}</Card.Title>
        <Card.Text>${precio.toLocaleString('es-CL')}</Card.Text>
        <Button variant="dark" onClick={manejarAgregar} className="mb-2">
          {agregado ? 'Agregado al carrito' : 'Agregar al carrito'}
        </Button>
        <Button
          className="mt-auto"
          variant={favorito ? 'warning' : 'outline-secondary'}
          onClick={() => toggleFavorito(id)}
        >
          {favorito ? '★ Favorito' : '☆ Favorito'}
        </Button>
      </Card.Body>
    </Card>
  )
}

export default ProductCard
