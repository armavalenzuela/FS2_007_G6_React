import { formatPrice } from '../../utils/formatPrice'

function PriceTag({ precio, precioUnitario, className = '' }) {
  return (
    <div className={`price-tag ${className}`}>
      <div>{formatPrice(precio)}</div>
      {typeof precioUnitario === 'number' && precioUnitario !== precio && (
        <div className="precio-unitario">antes {formatPrice(precioUnitario)}</div>
      )}
    </div>
  )
}

export default PriceTag
