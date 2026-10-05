import { useMemo, useState } from 'react'
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'
import { calcularTotalesPedido } from '../utils/descuentos'
import CartSummary from '../components/organisms/CartSummary'

function Checkout() {
  const { items, clearCart } = useCart()
  const { usuarioActual } = useAuth()
  const { crearPedido } = useOrders()
  const navigate = useNavigate()

  const [metodoEntrega, setMetodoEntrega] = useState(
    usuarioActual?.preferencias?.tipoEntrega || 'delivery',
  )
  const [fechaEntregaPreferida, setFechaEntregaPreferida] = useState('')
  const [direccion, setDireccion] = useState('')
  const [notas, setNotas] = useState('')
  const [error, setError] = useState('')

  const totales = useMemo(
    () => calcularTotalesPedido(items, usuarioActual),
    [items, usuarioActual],
  )

  const minDate = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  }, [])

  if (!usuarioActual) {
    return <Navigate to="/login?redirect=/checkout" replace />
  }

  if (items.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h1>Checkout</h1>
        <p className="text-muted">Tu carrito está vacío</p>
        <Button as={Link} to="/catalogo" variant="dark">
          Ir al catálogo
        </Button>
      </Container>
    )
  }

  function manejarConfirmar(e) {
    e.preventDefault()
    setError('')

    if (metodoEntrega === 'delivery' && !direccion.trim()) {
      setError('Debes ingresar una dirección de entrega para delivery.')
      return
    }

    if (!fechaEntregaPreferida) {
      setError('Selecciona una fecha de entrega preferida.')
      return
    }

    const pedido = crearPedido({
      items,
      usuario: usuarioActual,
      metodoEntrega,
      fechaEntregaPreferida,
      direccion: metodoEntrega === 'delivery' ? direccion.trim() : 'Retiro en tienda',
      notas: notas.trim(),
    })

    clearCart()
    navigate(`/pedidos/${pedido.id}`)
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">Confirmar pedido</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        <Col lg={7}>
          <div className="border rounded p-4 bg-light">
            <h4 className="mb-3">Datos de entrega</h4>

            <Form onSubmit={manejarConfirmar}>
              <Form.Group className="mb-3">
                <Form.Label>Método de entrega</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    name="metodo"
                    id="metodo-delivery"
                    label="Delivery a domicilio"
                    checked={metodoEntrega === 'delivery'}
                    onChange={() => setMetodoEntrega('delivery')}
                  />
                  <Form.Check
                    type="radio"
                    name="metodo"
                    id="metodo-retiro"
                    label="Retiro en tienda"
                    checked={metodoEntrega === 'retiro'}
                    onChange={() => setMetodoEntrega('retiro')}
                  />
                </div>
              </Form.Group>

              {metodoEntrega === 'delivery' && (
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="checkout-direccion">Dirección de entrega</Form.Label>
                  <Form.Control
                    id="checkout-direccion"
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Calle, número, comuna"
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label htmlFor="checkout-fecha">Fecha de entrega preferida</Form.Label>
                <Form.Control
                  id="checkout-fecha"
                  type="date"
                  value={fechaEntregaPreferida}
                  onChange={(e) => setFechaEntregaPreferida(e.target.value)}
                  min={minDate}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="checkout-notas">Notas del pedido (opcional)</Form.Label>
                <Form.Control
                  id="checkout-notas"
                  as="textarea"
                  rows={3}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ej: entregar después de las 15:00, timbre rojo…"
                />
              </Form.Group>

              <div className="d-flex gap-2 flex-wrap">
                <Button type="submit" variant="dark" size="lg">
                  Confirmar pedido y generar boleta
                </Button>
                <Button as={Link} to="/carrito" variant="outline-dark">
                  Volver al carrito
                </Button>
              </div>
            </Form>
          </div>
        </Col>

        <Col lg={5}>
          <CartSummary
            totalItems={items.reduce((a, i) => a + i.cantidad, 0)}
            subtotal={totales.subtotal}
            descuentoPorcentaje={totales.descuentoPorcentaje}
            montoDescuento={totales.montoDescuento}
            montoGratuito={totales.montoGratuito}
            total={totales.total}
            motivos={totales.motivos}
            onContinuar={() => {}}
            requiereLogin={false}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Checkout
