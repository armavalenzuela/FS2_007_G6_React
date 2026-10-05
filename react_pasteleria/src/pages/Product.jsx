import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Badge, Button, Alert } from 'react-bootstrap'
import { useCart } from '../context/CartContext'
import productos from '../data/Productos'
import { calcularPrecioUnitario, obtenerTamaño } from '../data/Tamaños'
import CustomizationForm from '../components/molecules/CustomizationForm'
import { formatPrice } from '../utils/formatPrice'

function Product() {
  const { id } = useParams()
  const { addItem, toggleFavorito, esFavorito } = useCart()

  const producto = productos.find((p) => p.id === id)

  const [tamañoId, setTamañoId] = useState(producto?.tamañoBase.toLowerCase() || 'mediano')
  const [mensaje, setMensaje] = useState('')
  const [agregado, setAgregado] = useState(false)

  if (!producto) {
    return (
      <Container className="my-5 text-center">
        <h1>Producto no encontrado</h1>
        <p className="text-muted">
          El producto que buscas no existe en nuestro catálogo
        </p>
        <Button as={Link} to="/catalogo" variant="dark">
          Volver al catálogo
        </Button>
      </Container>
    )
  }

  const precioUnitario = calcularPrecioUnitario(
    producto.precio,
    tamañoId,
    producto.personalizable,
  )
  const esFavoritoActual = esFavorito(producto.id)

  function manejarAgregar() {
    addItem(producto, {
      tamaño: obtenerTamaño(tamañoId, producto.personalizable).nombre,
      mensaje,
      precioUnitario,
    })
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2500)
  }

  return (
    <Container className="my-4">
      <Row className="g-4">
        <Col md={7}>
          <div className="mb-3">
            <span className="badge bg-secondary me-2">{producto.categoria}</span>
            {producto.tipo && (
              <Badge bg="dark">Torta {producto.tipo}</Badge>
            )}
          </div>

          <h1 className="mb-3">{producto.nombre}</h1>
          <p className="lead text-muted mb-4">{producto.descripcion}</p>

          <div className="mb-4">
            <div className="text-muted small mb-1">
              Precio base ({producto.tamañoBase})
            </div>
            <div className="fw-bold fs-4">{formatPrice(producto.precio)}</div>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <Button
              variant={esFavoritoActual ? 'warning' : 'outline-secondary'}
              onClick={() => toggleFavorito(producto.id)}
            >
              {esFavoritoActual ? '★ Favorito' : '☆ Favorito'}
            </Button>
            <Button as={Link} to="/catalogo" variant="outline-dark">
              Seguir mirando
            </Button>
          </div>
        </Col>

        <Col md={5}>
          <div className="border rounded p-4 h-100 bg-light">
            <h4 className="mb-3">Personaliza tu pedido</h4>

            <CustomizationForm
              producto={producto}
              tamañoId={tamañoId}
              onTamañoChange={setTamañoId}
              mensaje={mensaje}
              onMensajeChange={setMensaje}
              precioUnitario={precioUnitario}
              onAgregar={manejarAgregar}
            />

            {agregado && (
              <Alert variant="success" className="mb-0">
                ¡Producto agregado al carrito con éxito!
              </Alert>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Product
