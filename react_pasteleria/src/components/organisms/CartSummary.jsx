import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'

function CartSummary({
  totalItems,
  subtotal,
  descuentoPorcentaje,
  montoDescuento,
  montoGratuito,
  total,
  motivos,
  onContinuar,
  requiereLogin,
}) {
  return (
    <div className="border rounded p-3 bg-light">
      <h4 className="mb-3">Resumen del pedido</h4>

      <div className="d-flex justify-content-between mb-2">
        <span className="text-muted">Ítems</span>
        <span className="fw-bold">{totalItems}</span>
      </div>

      <hr />

      <div className="d-flex justify-content-between mb-1">
        <span className="text-muted">Subtotal</span>
        <span className="fw-bold">{formatPrice(subtotal)}</span>
      </div>

      {montoGratuito > 0 && (
        <div className="d-flex justify-content-between mb-1 text-success">
          <span>Torta gratis Duoc</span>
          <span className="fw-bold">−{formatPrice(montoGratuito)}</span>
        </div>
      )}

      {descuentoPorcentaje > 0 && (
        <div className="d-flex justify-content-between mb-1 text-success">
          <span>Descuento ({Math.round(descuentoPorcentaje * 100)}%)</span>
          <span className="fw-bold">−{formatPrice(montoDescuento)}</span>
        </div>
      )}

      {motivos && motivos.length > 0 && (
        <ul className="small text-muted mb-2 ps-3">
          {motivos.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}

      <hr />

      <div className="d-flex justify-content-between mb-4">
        <span className="fw-bold fs-5">Total</span>
        <span className="fw-bold fs-5">{formatPrice(total)}</span>
      </div>

      <div className="d-grid gap-2">
        <Button variant="dark" size="lg" onClick={onContinuar}>
          {requiereLogin ? 'Inicia sesión para continuar' : 'Continuar al pago'}
        </Button>
        <Button as={Link} to="/catalogo" variant="outline-dark">
          Seguir comprando
        </Button>
      </div>
    </div>
  )
}

export default CartSummary
