import { Card, Button } from 'react-bootstrap'
import { formatPrice } from '../../utils/formatPrice'

function CartItem({ item, onActualizarCantidad, onEliminar }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="flex-grow-1">
            <h5 className="mb-1">{item.nombre}</h5>
            <div className="text-muted small mb-1">
              {item.categoria} — Tamaño: {item.tamaño}
            </div>
            {item.mensaje && (
              <div className="text-muted small fst-italic">
                Mensaje: “{item.mensaje}”
              </div>
            )}
            {item.esGratisDuoc && (
              <div className="text-success small fw-bold">
                ¡Torta gratis por cumpleaños Duoc!
              </div>
            )}
          </div>

          <div className="d-flex flex-column align-items-md-end gap-2">
            <div className="fw-bold">
              {item.esGratisDuoc ? 'GRATIS' : formatPrice(item.precioUnitario)}
            </div>
            <div className="d-inline-flex align-items-center gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => onActualizarCantidad(item.key, item.cantidad - 1)}
                disabled={item.cantidad <= 1}
              >
                −
              </Button>
              <span className="fw-bold">{item.cantidad}</span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => onActualizarCantidad(item.key, item.cantidad + 1)}
              >
                +
              </Button>
            </div>
            <div className="text-md-end">
              <div className="text-muted small">Subtotal</div>
              <div className="fw-bold">{formatPrice(item.subtotal)}</div>
            </div>
            <Button variant="outline-danger" size="sm" onClick={() => onEliminar(item.key)}>
              Eliminar
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default CartItem
