import { useState } from 'react'
import { Container, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { calcularEdad, esCorreoDuoc, obtenerDescuentosUsuario } from '../utils/descuentos'

function Perfil() {
  const { usuarioActual, actualizarPerfil, actualizarPreferencias } = useAuth()

  const [datos, setDatos] = useState({
    nombre: usuarioActual?.nombre || '',
    email: usuarioActual?.email || '',
    fechaNacimiento: usuarioActual?.fechaNacimiento || '',
  })
  const [preferencias, setPreferencias] = useState({
    categoriaFavorita: usuarioActual?.preferencias?.categoriaFavorita || '',
    recibirPromociones: usuarioActual?.preferencias?.recibirPromociones ?? true,
    tipoEntrega: usuarioActual?.preferencias?.tipoEntrega || 'delivery',
  })
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  if (!usuarioActual) {
    return (
      <Container className="my-5 text-center">
        <h1>Mi perfil</h1>
        <p className="text-muted">Debes iniciar sesión para ver tu perfil</p>
        <Button href="/login" variant="dark">
          Ir a iniciar sesión
        </Button>
      </Container>
    )
  }

  const edad = calcularEdad(usuarioActual.fechaNacimiento)
  const esDuoc = esCorreoDuoc(usuarioActual.email)
  const descuentos = obtenerDescuentosUsuario(usuarioActual)

  function guardarDatos(e) {
    e.preventDefault()
    setError('')
    setMensaje('')

    const resultado = actualizarPerfil(datos)
    if (!resultado.ok) {
      setError(resultado.error)
      return
    }
    setMensaje('Datos personales actualizados correctamente.')
  }

  function guardarPreferencias(e) {
    e.preventDefault()
    setError('')
    setMensaje('')

    const resultado = actualizarPreferencias(preferencias)
    if (!resultado.ok) {
      setError(resultado.error)
      return
    }
    setMensaje('Preferencias de compra actualizadas correctamente.')
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">Mi perfil</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {mensaje && <Alert variant="success">{mensaje}</Alert>}

      <Row className="g-4">
        <Col lg={4}>
          <div className="border rounded p-4 h-100 bg-light">
            <h4 className="mb-3">Beneficios activos</h4>

            <div className="mb-3">
              <div className="text-muted small">Edad</div>
              <div className="fw-bold">{edad} años</div>
            </div>

            <div className="mb-3">
              <div className="text-muted small">Correo</div>
              <div className="fw-bold">{usuarioActual.email}</div>
              {esDuoc && (
                <Badge bg="success" className="mt-1">
                  Estudiante Duoc
                </Badge>
              )}
            </div>

            <div className="mb-3">
              <div className="text-muted small">Código de descuento</div>
              <div className="fw-bold">
                {usuarioActual.codigoDescuento || 'Sin código'}
              </div>
            </div>

            <hr />

            <h5>Descuentos aplicables</h5>
            {descuentos.motivos.length === 0 ? (
              <p className="text-muted small mb-0">
                Aún no tienes descuentos activos. Regístrate con el código FELICES50 o
                ten más de 50 años para obtener beneficios.
              </p>
            ) : (
              <ul className="small mb-0">
                {descuentos.motivos.map((m) => (
                  <li key={m} className="text-success">
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Col>

        <Col lg={4}>
          <div className="border rounded p-4 h-100 bg-light">
            <h4 className="mb-3">Datos personales</h4>
            <Form onSubmit={guardarDatos}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="perfil-nombre">Nombre completo</Form.Label>
                <Form.Control
                  id="perfil-nombre"
                  type="text"
                  value={datos.nombre}
                  onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="perfil-email">Correo electrónico</Form.Label>
                <Form.Control
                  id="perfil-email"
                  type="email"
                  value={datos.email}
                  onChange={(e) => setDatos({ ...datos, email: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="perfil-fecha">Fecha de nacimiento</Form.Label>
                <Form.Control
                  id="perfil-fecha"
                  type="date"
                  value={datos.fechaNacimiento}
                  onChange={(e) => setDatos({ ...datos, fechaNacimiento: e.target.value })}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="dark" className="w-100">
                Guardar datos
              </Button>
            </Form>
          </div>
        </Col>

        <Col lg={4}>
          <div className="border rounded p-4 h-100 bg-light">
            <h4 className="mb-3">Preferencias de compra</h4>
            <Form onSubmit={guardarPreferencias}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="pref-categoria">Categoría favorita</Form.Label>
                <Form.Select
                  id="pref-categoria"
                  value={preferencias.categoriaFavorita}
                  onChange={(e) =>
                    setPreferencias({ ...preferencias, categoriaFavorita: e.target.value })
                  }
                >
                  <option value="">Sin preferencia</option>
                  <option value="Tortas cuadradas">Tortas cuadradas</option>
                  <option value="Tortas circulares">Tortas circulares</option>
                  <option value="Postres individuales">Postres individuales</option>
                  <option value="Productos sin azúcar">Productos sin azúcar</option>
                  <option value="Pastelería tradicional">Pastelería tradicional</option>
                  <option value="Productos sin gluten">Productos sin gluten</option>
                  <option value="Productos vegana">Productos vegana</option>
                  <option value="Tortas especiales">Tortas especiales</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="pref-entrega">Tipo de entrega preferida</Form.Label>
                <Form.Select
                  id="pref-entrega"
                  value={preferencias.tipoEntrega}
                  onChange={(e) =>
                    setPreferencias({ ...preferencias, tipoEntrega: e.target.value })
                  }
                >
                  <option value="delivery">Delivery a domicilio</option>
                  <option value="retiro">Retiro en tienda</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="switch"
                  id="pref-promos"
                  label="Recibir promociones y noticias"
                  checked={preferencias.recibirPromociones}
                  onChange={(e) =>
                    setPreferencias({ ...preferencias, recibirPromociones: e.target.checked })
                  }
                />
              </Form.Group>

              <Button type="submit" variant="outline-dark" className="w-100">
                Guardar preferencias
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Perfil
