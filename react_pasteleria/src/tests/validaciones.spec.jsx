import { nombreValido, comentarioValido, validarLogin, validarRegistro, validarDireccion, fechaFutura } from "../utils/validaciones.js";
import { filtrarProductos, categoriasUnicas } from "../utils/filtros.js";
import { formatoPesos } from "../utils/formato.js";

const catalogo = [
  { nombre: "Torta Cuadrada de Chocolate", categoria: "Tortas Cuadradas", tipo: "cuadrada", precio: 45000, enOferta: false, descuentoOferta: 0 },
  { nombre: "Mousse de Chocolate", categoria: "Postres Individuales", tipo: "individual", precio: 5000, enOferta: false, descuentoOferta: 0 },
  { nombre: "Tiramisú Clásico", categoria: "Postres Individuales", tipo: "individual", precio: 5500, enOferta: true, descuentoOferta: 20 },
];

describe("Validaciones de formularios", () => {
  it("el nombre de contacto no admite números", () => {
    expect(nombreValido("Ana Pérez")).toBe(true);
    expect(nombreValido("Ana 2")).toBe(false);
    expect(nombreValido("   ")).toBe(false);
  });

  it("el comentario debe tener entre 1 y 500 caracteres", () => {
    expect(comentarioValido("Hola")).toBe(true);
    expect(comentarioValido("a".repeat(501))).toBe(false);
  });

  it("login: informa errores de correo y contraseña", () => {
    const errores = validarLogin({ correo: "x@hotmail.com", contrasena: "corta" });
    expect(errores.correo).toBeDefined();
    expect(errores.contrasena).toBeDefined();
    expect(validarLogin({ correo: "x@gmail.com", contrasena: "abcdefgh" })).toEqual({});
  });

  it("registro: exige coincidencia de contraseñas y términos aceptados", () => {
    const base = { nombre: "Ana Pérez", correo: "ana@gmail.com", fechaNacimiento: "1990-05-05", contrasena: "abcdefgh", confirmacion: "otra", terminos: false };
    const errores = validarRegistro(base, () => false);
    expect(errores.confirmacion).toBeDefined();
    expect(errores.terminos).toBeDefined();
  });

  it("registro: rechaza un correo que ya existe", () => {
    const base = { nombre: "Ana Pérez", correo: "ana@gmail.com", fechaNacimiento: "1990-05-05", contrasena: "abcdefgh", confirmacion: "abcdefgh", terminos: true };
    expect(validarRegistro(base, () => true).correo).toBeDefined();
    expect(validarRegistro(base, () => false)).toEqual({});
  });

  it("dirección: la fecha de entrega no puede estar en el pasado", () => {
    expect(fechaFutura("2020-01-01")).toBe(false);
    expect(fechaFutura("2030-01-01")).toBe(true);
  });

  it("dirección: pide calle, región y comuna", () => {
    const errores = validarDireccion({ nombre: "Ana", apellidos: "P", correo: "a@b.cl", calle: "", region: "", comuna: "", fechaEntrega: "2030-01-01" });
    expect(errores.calle).toBeDefined();
    expect(errores.region).toBeDefined();
    expect(errores.comuna).toBeDefined();
  });
});

describe("Filtros del catálogo", () => {
  it("filtra por texto sin distinguir mayúsculas", () => {
    expect(filtrarProductos(catalogo, { texto: "CHOCOLATE" }).length).toBe(2);
  });

  it("combina categoría y tipo", () => {
    const r = filtrarProductos(catalogo, { categoria: "Postres Individuales", tipo: "individual" });
    expect(r.length).toBe(2);
  });

  it("ordena por precio usando el precio final (considerando ofertas)", () => {
    const asc = filtrarProductos(catalogo, { orden: "asc" }).map((p) => p.nombre);
    expect(asc[0]).toBe("Tiramisú Clásico");
    expect(asc[1]).toBe("Mousse de Chocolate");
    const desc = filtrarProductos(catalogo, { orden: "desc" }).map((p) => p.nombre);
    expect(desc[0]).toBe("Torta Cuadrada de Chocolate");
  });

  it("obtiene las categorías sin repetir", () => {
    expect(categoriasUnicas(catalogo).length).toBe(2);
  });
});

describe("Formato de pesos", () => {
  it("muestra montos en pesos chilenos", () => {
    expect(formatoPesos(45000)).toContain("45");
    expect(formatoPesos(45000).startsWith("$")).toBe(true);
  });
});
