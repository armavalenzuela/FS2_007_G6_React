import { useMemo } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { calcularTotalesPedido } from '../utils/descuentos'
import CartItem from '../components/molecules/CartItem'
import CartSummary from '../components/organisms/CartSummary'

function Cart() {
  const { items, totalItems, updateQuantity, removeItem } = useCart()
  const { usuarioActual } = useAuth()
  const navigate = useNavigate()

  const totales = useMemo(
    () => calcularTotalesPedido(items, usuarioActual),
    [items, usuarioActual],
  )

  function manejarContinuar() {
    if (!usuarioActual) {
      navigate('/login?redirect=/checkout')
      return
    }
    navigate('/checkout')
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">Tu carrito</h1>

      {items.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="mb-3">Tu carrito está vacío</h3>
          <p className="text-muted mb-4">
            Explora nuestro catálogo y encuentra tu próxima favorita
          </p>
          <Button as={Link} to="/catalogo" variant="dark" size="lg">
            Ir al catálogo
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            {items.map((item) => (
              <CartItem
                key={item.key}
                item={item}
                onActualizarCantidad={updateQuantity}
                onEliminar={removeItem}
              />
            ))}

            <div className="mt-3">
              <Button as={Link} to="/catalogo" variant="outline-dark">
                Seguir comprando
              </Button>
            </div>
          </Col>

          <Col lg={4}>
            <CartSummary
              totalItems={totalItems}
              subtotal={totales.subtotal}
              descuentoPorcentaje={totales.descuentoPorcentaje}
              montoDescuento={totales.montoDescuento}
              montoGratuito={totales.montoGratuito}
              total={totales.total}
              motivos={totales.motivos}
              onContinuar={manejarContinuar}
              requiereLogin={!usuarioActual}
            />
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default Cart
