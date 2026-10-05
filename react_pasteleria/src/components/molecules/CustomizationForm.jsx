import { Form, Button } from 'react-bootstrap'
import { tamaños, tamañosFijos } from '../../data/Tamaños'
import { formatPrice } from '../../utils/formatPrice'

function CustomizationForm({
  producto,
  tamañoId,
  onTamañoChange,
  mensaje,
  onMensajeChange,
  precioUnitario,
  onAgregar,
}) {
  const opciones = producto.personalizable ? tamaños : tamañosFijos
  const tamañoActual = opciones.find((t) => t.id === tamañoId) || opciones[0]

  return (
    <div className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label htmlFor="select-tamaño">
          {producto.personalizable ? 'Tamaño de la torta' : 'Tamaño'}
        </Form.Label>
        <Form.Select
          id="select-tamaño"
          value={tamañoId}
          onChange={(e) => onTamañoChange(e.target.value)}
        >
          {opciones.map((op) => (
            <option key={op.id} value={op.id}>
              {op.nombre} — {op.detalle}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {producto.personalizable && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="input-mensaje">Mensaje especial (opcional)</Form.Label>
          <Form.Control
            id="input-mensaje"
            type="text"
            maxLength={80}
            placeholder="Ej: Feliz cumpleaños mamá"
            value={mensaje}
            onChange={(e) => onMensajeChange(e.target.value)}
          />
          <Form.Text className="text-muted">
            {mensaje.length}/80 caracteres — se imprimirá sobre la torta
          </Form.Text>
        </Form.Group>
      )}

      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
        <div>
          <div className="text-muted small mb-1">
            Precio unitario ({tamañoActual.nombre})
          </div>
          <div className="fw-bold fs-5">{formatPrice(precioUnitario)}</div>
        </div>
        <Button variant="dark" size="lg" onClick={onAgregar}>
          Agregar al carrito
        </Button>
      </div>
    </div>
  )
}

export default CustomizationForm
