import { Container, Button, Badge, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrderContext'
import { formatPrice } from '../utils/formatPrice'

const coloresEstado = {
  preparacion: 'warning',
  empaque: 'info',
  en_camino: 'primary',
  entregado: 'success',
}

function Pedidos() {
  const { usuarioActual } = useAuth()
  const { pedidos, etiquetasEstado } = useOrders()

  if (!usuarioActual) {
    return (
      <Container className="my-5 text-center">
        <h1>Mis pedidos</h1>
        <p className="text-muted">Debes iniciar sesión para ver tus pedidos</p>
        <Button as={Link} to="/login" variant="dark">
          Ir a iniciar sesión
        </Button>
      </Container>
    )
  }

  const misPedidos = pedidos.filter((p) => p.cliente?.email === usuarioActual.email)

  return (
    <Container className="my-4">
      <h1 className="mb-4">Mis pedidos</h1>

      {misPedidos.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="mb-3">Aún no tienes pedidos</h3>
          <p className="text-muted mb-4">Haz tu primer pedido y síguelo desde aquí</p>
          <Button as={Link} to="/catalogo" variant="dark">
            Explorar catálogo
          </Button>
        </div>
      ) : (
        <div className="border rounded p-3 bg-light">
          <Table responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Entrega</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {misPedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>
                    <strong>{pedido.id}</strong>
                    <div className="text-muted small">Boleta {pedido.boleta}</div>
                  </td>
                  <td className="small">
                    {new Date(pedido.fecha).toLocaleDateString('es-CL')}
                  </td>
                  <td className="small">
                    {pedido.metodoEntrega === 'delivery' ? 'Delivery' : 'Retiro'}
                    {pedido.fechaEntregaPreferida && (
                      <div className="text-muted">{pedido.fechaEntregaPreferida}</div>
                    )}
                  </td>
                  <td className="fw-bold">{formatPrice(pedido.total)}</td>
                  <td>
                    <Badge bg={coloresEstado[pedido.estado] || 'secondary'}>
                      {etiquetasEstado[pedido.estado]}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      as={Link}
                      to={`/pedidos/${pedido.id}`}
                      variant="outline-dark"
                      size="sm"
                    >
                      Ver detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  )
}

export default Pedidos
