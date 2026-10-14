import { Link, useParams } from "react-router-dom";

// Contenido del blog migrado desde blog.html, blogdetalle1.html y blogdetalle2.html
export const ENTRADAS_BLOG = [
  { id: "1", categoria: "Historia", titulo: "El día que hicimos historia: la torta más grande del mundo",
    resumen: "En 1995 nuestro equipo participó en un récord Guinness. Te contamos cómo se vivió ese día.",
    autor: "Publicado por el equipo de Pastelería Mil Sabores",
    parrafos: [
      "Corría el año 1995 cuando nuestra pastelería se sumó a un desafío que marcaría nuestra historia para siempre: participar en la creación de la torta más grande del mundo, un hito reconocido por el libro Guinness de los récords.",
      "Durante semanas, nuestro equipo de maestros pasteleros trabajó codo a codo con reposteros de distintas partes del país, combinando técnicas tradicionales con la logística necesaria para un proyecto de esa escala. El resultado fue una celebración inolvidable para toda la comunidad.",
      "Hoy, 30 años después, ese espíritu de trabajo en equipo y amor por la repostería sigue siendo el corazón de cada torta que sale de nuestro local.",
    ] },
  { id: "2", categoria: "Receta", titulo: "Tarta de Santiago paso a paso",
    resumen: "Un estudiante de gastronomía de Duoc UC comparte su versión de esta receta tradicional.",
    autor: "Publicado por un estudiante de gastronomía de Duoc UC",
    parrafos: [
      "La Tarta de Santiago es un postre tradicional español, hecho principalmente a base de almendras molidas, azúcar y huevo, sin harina de trigo. Su origen se remonta a la región de Galicia, y hoy es uno de los postres favoritos de nuestros clientes.",
      "Ingredientes principales: almendras molidas, azúcar, huevos y ralladura de limón. Se hornea hasta lograr una textura húmeda por dentro y ligeramente dorada por fuera, y se decora tradicionalmente con la cruz de Santiago espolvoreada en azúcar flor.",
      "En Pastelería Mil Sabores la preparamos siguiendo la receta clásica, con el toque especial de nuestros estudiantes en práctica, que aportan pequeñas variaciones para hacerla aún más especial.",
    ] },
  { id: "3", categoria: "Consejos", titulo: "Cómo conservar una torta personalizada",
    resumen: "Tips de nuestros pasteleros para que tu torta especial luzca perfecta hasta la celebración.", autor: "", parrafos: [] },
  { id: "4", categoria: "Sin azúcar", titulo: "Endulzar sin azúcar: el secreto de nuestra línea saludable",
    resumen: "Descubre cómo logramos el dulzor de nuestra Torta Sin Azúcar de Naranja usando endulzantes naturales.", autor: "", parrafos: [] },
  { id: "5", categoria: "Vegano", titulo: "Repostería vegana: mitos y verdades",
    resumen: "Nuestra Torta Vegana de Chocolate demuestra que se puede lograr una textura húmeda y un sabor intenso sin productos de origen animal.", autor: "", parrafos: [] },
  { id: "6", categoria: "Comunidad", titulo: "De la sala de clases a tu mesa",
    resumen: "Conoce cómo cada compra en Mil Sabores apoya la formación práctica de estudiantes de gastronomía.", autor: "", parrafos: [] },
];

export function Blog() {
  return (
    <>
      <header className="hero-mil-sabores">
        <div className="container">
          <h1>Blog y comunidad</h1>
          <p className="fs-5">Recetas, consejos y curiosidades, escritos con diversos estudiantes de gastronomía.</p>
        </div>
      </header>
      <section className="seccion">
        <div className="container">
          <div className="row g-4">
            {ENTRADAS_BLOG.map((e) => (
              <div className="col-md-6 col-lg-4" key={e.id}>
                <article className="card-producto p-4 h-100 d-flex flex-column">
                  <span className="chip-categoria mb-2 align-self-start">{e.categoria}</span>
                  <h2 className="h5">{e.titulo}</h2>
                  <p className="texto-secundario">{e.resumen}</p>
                  {e.parrafos.length > 0 && <Link to={`/blog/${e.id}`} className="mt-auto">Leer más</Link>}
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function BlogDetalle() {
  const { id } = useParams();
  const entrada = ENTRADAS_BLOG.find((e) => e.id === id);
  if (!entrada || entrada.parrafos.length === 0) {
    return (
      <section className="seccion text-center">
        <h2>Esta entrada no está disponible</h2>
        <Link to="/blog">Volver al blog</Link>
      </section>
    );
  }
  return (
    <section className="seccion">
      <div className="container" style={{ maxWidth: 800 }}>
        <Link to="/blog">Volver al blog</Link>
        <span className="chip-categoria d-block w-auto d-inline-block mt-3">{entrada.categoria}</span>
        <h1 className="fs-2 mt-2">{entrada.titulo}</h1>
        <p className="small texto-secundario">{entrada.autor}</p>
        {entrada.parrafos.map((texto, i) => <p key={i}>{texto}</p>)}
      </div>
    </section>
  );
}

export default Blog;
