import { Container, Button, Badge, Row, Col, Alert } from 'react-bootstrap'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useOrders } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'
import OrderSummary from '../components/organisms/OrderSummary'
import { formatPrice } from '../utils/formatPrice'

const coloresEstado = {
  preparacion: 'warning',
  empaque: 'info',
  en_camino: 'primary',
  entregado: 'success',
}

function PedidoDetalle() {
  const { id } = useParams()
  const { obtenerPedido, avanzarEstadoPedido, etiquetasEstado } = useOrders()
  const { usuarioActual } = useAuth()

  const pedido = obtenerPedido(id)

  if (!usuarioActual) {
    return <Navigate to="/login" replace />
  }

  if (!pedido) {
    return (
      <Container className="my-5 text-center">
        <h1>Pedido no encontrado</h1>
        <Button as={Link} to="/pedidos" variant="dark">
          Volver a mis pedidos
        </Button>
      </Container>
    )
  }

  const esPropietario = !pedido.cliente || pedido.cliente.email === usuarioActual.email

  if (!esPropietario) {
    return <Navigate to="/pedidos" replace />
  }

  function manejarImprimir() {
    window.print()
  }

  return (
    <Container className="my-4">
      <h1 className="mb-1">Pedido {pedido.id}</h1>
      <p className="text-muted mb-4">Boleta {pedido.boleta}</p>

      <Row className="g-4">
        <Col lg={7}>
          <div className="border rounded p-4 bg-light mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Seguimiento del pedido</h4>
              <Badge bg={coloresEstado[pedido.estado] || 'secondary'} className="fs-6">
                {etiquetasEstado[pedido.estado]}
              </Badge>
            </div>

            {pedido.estado !== 'entregado' && (
              <div className="mb-3">
                <Button variant="secondary" onClick={() => avanzarEstadoPedido(pedido.id)}>
                  Simular siguiente estado
                </Button>
                <div className="text-muted small mt-1">
                  (Botón de demostración para ver el avance del pedido)
                </div>
              </div>
            )}

            <ul className="list-unstyled mb-0">
              {pedido.historialEstados.map((h, index) => (
                <li
                  key={`${h.estado}-${index}`}
                  className={`mb-2 p-3 rounded border ${
                    index === pedido.historialEstados.length - 1 ? 'bg-white' : ''
                  }`}
                >
                  <div className="d-flex justify-content-between">
                    <strong>{etiquetasEstado[h.estado]}</strong>
                    <small className="text-muted">
                      {new Date(h.fecha).toLocaleString('es-CL')}
                    </small>
                  </div>
                  <div className="text-muted small">{h.mensaje}</div>
                </li>
              ))}
            </ul>
          </div>

          {pedido.motivosDescuento && pedido.motivosDescuento.length > 0 && (
            <Alert variant="success">
              <strong>Beneficios aplicados:</strong>
              <ul className="mb-0 small">
                {pedido.motivosDescuento.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Alert>
          )}

          <div className="border rounded p-4 bg-light">
            <h4 className="mb-3">Productos del pedido</h4>
            {pedido.items.map((item) => (
              <div
                key={item.key}
                className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom"
              >
                <div>
                  <strong>{item.nombre}</strong>
                  <div className="text-muted small">
                    {item.tamaño} × {item.cantidad}
                    {item.mensaje ? ` — "${item.mensaje}"` : ''}
                    {item.esGratisDuoc ? ' — GRATIS' : ''}
                  </div>
                </div>
                <div className="fw-bold">
                  {item.esGratisDuoc ? 'GRATIS' : formatPrice(item.subtotal)}
                </div>
              </div>
            ))}
          </div>
        </Col>

        <Col lg={5}>
          <OrderSummary pedido={pedido} onImprimir={manejarImprimir} />
        </Col>
      </Row>
    </Container>
  )
}

export default PedidoDetalle
