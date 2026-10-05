import { Button } from 'react-bootstrap'
import { formatPrice } from '../../utils/formatPrice'

function OrderSummary({ pedido, onImprimir }) {
  return (
    <div className="border rounded p-3 bg-light">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h4 className="mb-1">Boleta</h4>
          <div className="text-muted small">
            N° {pedido.boleta} — Pedido {pedido.id}
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={onImprimir}>
          Imprimir
        </Button>
      </div>

      <hr />

      {pedido.items.map((item) => (
        <div key={item.key} className="d-flex justify-content-between mb-2 small">
          <span>
            {item.nombre}
            <br />
            <span className="text-muted">
              {item.tamaño} × {item.cantidad}
              {item.esGratisDuoc ? ' — GRATIS' : ''}
            </span>
          </span>
          <span className="fw-bold">{formatPrice(item.subtotal)}</span>
        </div>
      ))}

      <hr />

      <div className="d-flex justify-content-between mb-1">
        <span className="text-muted">Subtotal</span>
        <span>{formatPrice(pedido.subtotal)}</span>
      </div>

      {pedido.montoGratuito > 0 && (
        <div className="d-flex justify-content-between mb-1 text-success">
          <span>Torta gratis Duoc</span>
          <span>−{formatPrice(pedido.montoGratuito)}</span>
        </div>
      )}

      {pedido.montoDescuento > 0 && (
        <div className="d-flex justify-content-between mb-1 text-success">
          <span>Descuento aplicado</span>
          <span>−{formatPrice(pedido.montoDescuento)}</span>
        </div>
      )}

      <div className="d-flex justify-content-between mb-3">
        <span className="fw-bold">Total</span>
        <span className="fw-bold">{formatPrice(pedido.total)}</span>
      </div>

      <hr />

      <div className="small text-muted">
        <div>
          <strong>Entrega:</strong>{' '}
          {pedido.metodoEntrega === 'delivery' ? 'Delivery' : 'Retiro en tienda'}
        </div>
        {pedido.fechaEntregaPreferida && (
          <div>
            <strong>Fecha preferida:</strong> {pedido.fechaEntregaPreferida}
          </div>
        )}
        {pedido.direccion && (
          <div>
            <strong>Dirección:</strong> {pedido.direccion}
          </div>
        )}
        {pedido.cliente && (
          <div>
            <strong>Cliente:</strong> {pedido.cliente.nombre} ({pedido.cliente.email})
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderSummary
