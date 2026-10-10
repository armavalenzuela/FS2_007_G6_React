import { Navbar, Nav, Container } from 'react-bootstrap'

function NavBar() {
  return (
    <Navbar expand="md" className="navbar-mil-sabores">
      <Container>
        <Navbar.Brand href="/">Pastelería</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            <Nav.Link href="/">Inicio</Nav.Link>
            <Nav.Link href="/catalogo">Catálogo</Nav.Link>
            <Nav.Link href="/carrito">Carrito</Nav.Link>
            <Nav.Link href="/pedidos">Mis pedidos</Nav.Link>
            <Nav.Link href="/perfil">Mi perfil</Nav.Link>
            <Nav.Link href="/registro">Registro</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar