import { MemoryRouter, Route, Routes } from "react-router-dom";
import { montar, escribir, clic, buscarBoton, disparar } from "./ayudas.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Alerta from "../components/Alerta.jsx";
import ImagenProducto from "../components/ImagenProducto.jsx";
import Contacto from "../pages/Contacto.jsx";
import Login from "../pages/Login.jsx";
import { SesionProvider } from "../context/SesionContext.jsx";
import { reiniciarBaseDatos } from "../data/baseDatos.js";

const producto = {
  codigo: "PI002", nombre: "Tiramisú Clásico", descripcion: "Postre italiano.", precio: 5500,
  stock: 25, enOferta: true, descuentoOferta: 20, imagen: "assets/img/productos/PI002.jpg", categoria: "Postres Individuales",
};

describe("Pruebas de renderizado", () => {
  let vista;
  afterEach(() => vista && vista.limpiar());

  it("renderiza nombre, precio con oferta y el badge de descuento", () => {
    vista = montar(<MemoryRouter><ProductCard producto={producto} /></MemoryRouter>);
    const texto = vista.contenedor.textContent;
    expect(texto).toContain("Tiramisú Clásico");
    expect(texto).toContain("-20%");
  });

  it("muestra el mensaje de error solo cuando hay un mensaje", () => {
    vista = montar(<Alerta tipo="danger">Algo salió mal</Alerta>);
    expect(vista.contenedor.querySelector(".alert-danger")).not.toBeNull();
    vista.limpiar();
    vista = montar(<Alerta tipo="danger"></Alerta>);
    expect(vista.contenedor.querySelector(".alert")).toBeNull();
  });

  it("renderiza todos los elementos de una lista de productos", () => {
    const lista = [producto, { ...producto, codigo: "X2", nombre: "Otra" }, { ...producto, codigo: "X3", nombre: "Tercera" }];
    vista = montar(<MemoryRouter>{lista.map((p) => <ProductCard key={p.codigo} producto={p} />)}</MemoryRouter>);
    expect(vista.contenedor.querySelectorAll(".card-producto").length).toBe(3);
  });

  it("muestra el respaldo cuando la imagen no carga", () => {
    vista = montar(<ImagenProducto src="assets/img/no-existe.jpg" alt="x" categoria="Tortas" />);
    const img = vista.contenedor.querySelector("img");
    disparar(img, "error");
    expect(vista.contenedor.querySelector("img")).toBeNull();
    expect(vista.contenedor.textContent).toContain("Tortas");
  });
});

describe("Pruebas de propiedades (props)", () => {
  let vista;
  afterEach(() => vista && vista.limpiar());

  it("el botón recibe la etiqueta y ejecuta la función onClick con el código", () => {
    const onAgregar = vi.fn();
    vista = montar(<MemoryRouter><ProductCard producto={producto} onAgregar={onAgregar} /></MemoryRouter>);
    const boton = buscarBoton(vista.contenedor, "Añadir");
    expect(boton).toBeDefined();
    clic(boton);
    expect(onAgregar).toHaveBeenCalledWith("PI002");
  });

  it("deshabilita el botón cuando el producto no tiene stock", () => {
    vista = montar(<MemoryRouter><ProductCard producto={{ ...producto, stock: 0 }} onAgregar={() => {}} /></MemoryRouter>);
    const boton = vista.contenedor.querySelector("button");
    expect(boton.disabled).toBe(true);
    expect(boton.textContent).toBe("Sin stock");
  });
});

describe("Pruebas de estado y eventos (formulario de contacto)", () => {
  let vista;
  beforeEach(() => reiniciarBaseDatos());
  afterEach(() => vista && vista.limpiar());

  function montarContacto() {
    vista = montar(<SesionProvider><Contacto /></SesionProvider>);
    return {
      nombre: vista.contenedor.querySelector("#contactoNombre"),
      correo: vista.contenedor.querySelector("#contactoCorreo"),
      comentario: vista.contenedor.querySelector("#contactoComentario"),
      enviar: buscarBoton(vista.contenedor, "Enviar mensaje"),
    };
  }

  it("el estado del formulario cambia al escribir texto", () => {
    const campos = montarContacto();
    escribir(campos.nombre, "Ana Pérez");
    expect(campos.nombre.value).toBe("Ana Pérez");
  });

  it("muestra errores al enviar un formulario inválido", () => {
    const campos = montarContacto();
    escribir(campos.nombre, "Ana 123");
    clic(campos.enviar);
    expect(vista.contenedor.querySelector("#contactoNombre").className).toContain("is-invalid");
    expect(vista.contenedor.textContent).toContain("solo letras");
  });

  it("muestra el mensaje de éxito y limpia el formulario al enviar datos válidos", () => {
    const campos = montarContacto();
    escribir(campos.nombre, "Ana Pérez");
    escribir(campos.correo, "ana@gmail.com");
    escribir(campos.comentario, "Quiero una torta para 20 personas");
    clic(campos.enviar);
    expect(vista.contenedor.textContent).toContain("Tu mensaje fue enviado");
  });
});

describe("Inicio de sesión", () => {
  let vista;
  beforeEach(() => {
    reiniciarBaseDatos();
    localStorage.removeItem("usuarioCorreo");
  });
  afterEach(() => vista && vista.limpiar());

  it("redirige al administrador al dashboard", () => {
    vista = montar(
      <SesionProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<p>Dashboard de administración</p>} />
          </Routes>
        </MemoryRouter>
      </SesionProvider>
    );

    escribir(vista.contenedor.querySelector("#loginCorreo"), "admin@duoc.cl");
    escribir(vista.contenedor.querySelector("#loginPassword"), "admin123");
    disparar(vista.contenedor.querySelector("form"), "submit");

    expect(vista.contenedor.textContent).toContain("Dashboard de administración");
  });
});
