export default function Nosotros() {
  return (
    <>
      <header className="hero-mil-sabores text-center">
        <div className="container">
          <h1>Nuestra historia</h1>
          <p className="fs-5 mx-auto" style={{ maxWidth: 600 }}>50 años de repostería chilena, hecho a mano, con ingredientes nobles y mucho cariño.</p>
        </div>
      </header>
      <section className="seccion">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6"><div className="card-producto p-4 h-100"><h2 className="h4">El comienzo de algo dulce</h2>
              <p>Desde hace 50 años evolucionando para ser un referente en la repostería chilena. En 1995 fuimos parte de un récord Guinness al colaborar en la creación de la torta más grande del mundo, un hito que hasta hoy nos recuerda de qué somos capaces cuando trabajamos con pasión.</p></div></div>
            <div className="col-md-6"><div className="card-producto p-4 h-100"><h2 className="h4">Origen de nuestras recetas</h2>
              <p>Nuestras recetas como la Torta Circular de Manjar o la Tarta de Santiago vienen de generaciones de maestros pasteleros, adaptadas con el tiempo pero fieles a su sabor original.</p></div></div>
          </div>
        </div>
      </section>
      <section className="seccion seccion-alterna">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-6"><h2 className="h4">Misión</h2><p className="texto-secundario">Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones, mientras fomentamos la creatividad en la repostería.</p></div>
            <div className="col-md-6"><h2 className="h4">Visión</h2><p className="texto-secundario">Convertirnos en la tienda online líder de productos de repostería en Chile, conocida por nuestra innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos talentos en gastronomía.</p></div>
          </div>
        </div>
      </section>
      <section className="seccion">
        <div className="container">
          <h2 className="text-center mb-4">Impacto comunitario</h2>
          <div className="row g-4">
            <div className="col-md-4"><div className="card-producto p-4 h-100"><h5>Alianza con universidades</h5><p className="texto-secundario mb-0">Trabajamos junto a estudiantes de gastronomía, que aportan recetas y consejos en nuestro blog.</p></div></div>
            <div className="col-md-4"><div className="card-producto p-4 h-100"><h5>Beneficio de cumpleaños</h5><p className="texto-secundario mb-0">Estudiantes de universidades que se registran con su correo institucional reciben diversos beneficios.</p></div></div>
            <div className="col-md-4"><div className="card-producto p-4 h-100"><h5>Compra con propósito</h5><p className="texto-secundario mb-0">Cada pedido ayuda a financiar talleres y prácticas para nuevos talentos de la repostería local.</p></div></div>
          </div>
        </div>
      </section>
    </>
  );
}
