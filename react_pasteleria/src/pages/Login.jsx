import { useState } from 'react'
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function manejarSubmit(e) {
    e.preventDefault()
    setError('')

    const resultado = iniciarSesion(email, password)
    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    navigate(redirect)
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <div className="border rounded p-4 bg-light">
            <h1 className="text-center mb-2">Iniciar sesión</h1>
            <p className="text-muted text-center mb-4">
              Accede para disfrutar de tus descuentos y seguimiento de pedidos
            </p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={manejarSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="login-email">Correo electrónico</Form.Label>
                <Form.Control
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label htmlFor="login-password">Contraseña</Form.Label>
                <Form.Control
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button type="submit" variant="dark" size="lg">
                  Entrar
                </Button>
                <Button as={Link} to="/registro" variant="outline-dark">
                  ¿No tienes cuenta? Regístrate
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Login
