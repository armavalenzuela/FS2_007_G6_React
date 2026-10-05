import { useState } from 'react'
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Registro() {
  const { registrar } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    codigoDescuento: '',
  })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function manejarSubmit(e) {
    e.preventDefault()
    setError('')
    setExito('')

    const resultado = registrar(form)
    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    const u = resultado.usuario
    const beneficios = []
    if (u.codigoDescuento === 'FELICES50') beneficios.push('10% de descuento de por vida')
    if (u.esEstudianteDuoc) beneficios.push('tortas gratis en tu cumpleaños como estudiante Duoc')
    if (beneficios.length === 0) {
      setExito('¡Cuenta creada con éxito! Ya puedes iniciar sesión.')
    } else {
      setExito(`¡Cuenta creada! Beneficios activados: ${beneficios.join(', ')}.`)
    }

    setTimeout(() => navigate('/'), 1800)
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="border rounded p-4 bg-light">
            <h1 className="text-center mb-2">Crear cuenta</h1>
            <p className="text-muted text-center mb-4">
              Regístrate y obtén beneficios exclusivos de nuestra pastelería
            </p>

            {error && <Alert variant="danger">{error}</Alert>}
            {exito && <Alert variant="success">{exito}</Alert>}

            <Form onSubmit={manejarSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="reg-nombre">Nombre completo</Form.Label>
                <Form.Control
                  id="reg-nombre"
                  type="text"
                  value={form.nombre}
                  onChange={(e) => actualizarCampo('nombre', e.target.value)}
                  placeholder="Ej: María Pérez"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="reg-email">Correo electrónico</Form.Label>
                <Form.Control
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => actualizarCampo('email', e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
                <Form.Text className="text-muted">
                  Usa tu correo institucional @duoc.cl para obtener tortas gratis en tu
                  cumpleaños
                </Form.Text>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="reg-password">Contraseña</Form.Label>
                    <Form.Control
                      id="reg-password"
                      type="password"
                      value={form.password}
                      onChange={(e) => actualizarCampo('password', e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="reg-fecha">Fecha de nacimiento</Form.Label>
                    <Form.Control
                      id="reg-fecha"
                      type="date"
                      value={form.fechaNacimiento}
                      onChange={(e) => actualizarCampo('fechaNacimiento', e.target.value)}
                      required
                    />
                    <Form.Text className="text-muted">
                      Mayor de 50 años = 50% de descuento
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="reg-codigo">Código de descuento (opcional)</Form.Label>
                <Form.Control
                  id="reg-codigo"
                  type="text"
                  value={form.codigoDescuento}
                  onChange={(e) => actualizarCampo('codigoDescuento', e.target.value)}
                  placeholder="Ej: FELICES50"
                />
                <Form.Text className="text-muted">
                  Con FELICES50 obtienes 10% de descuento de por vida
                </Form.Text>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button type="submit" variant="dark" size="lg">
                  Crear cuenta
                </Button>
                <Button as={Link} to="/login" variant="outline-dark">
                  ¿Ya tienes cuenta? Inicia sesión
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Registro
