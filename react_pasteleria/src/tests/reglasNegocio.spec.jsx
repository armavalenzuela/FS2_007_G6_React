import {
  calcularEdad, califica50, esCorreoDuoc, correoPermitido, contrasenaValida,
  precioUnitario, calcularTotales, validarStock, esStockCritico,
  DESCUENTO_FELICES50, CODIGO_TORTA_DUOC,
} from "../data/reglasNegocio.js";

const HOY = new Date(2026, 9, 10); 

const productos = [
  { codigo: "TC001", nombre: "Torta Cuadrada", precio: 45000, stock: 12, stockCritico: 3, enOferta: false, descuentoOferta: 0 },
  { codigo: "PI002", nombre: "Tiramisú", precio: 5500, stock: 25, stockCritico: 5, enOferta: true, descuentoOferta: 20 },
  { codigo: "TE001", nombre: "Torta Especial", precio: 55000, stock: 5, stockCritico: 2, enOferta: false, descuentoOferta: 0 },
];

describe("Reglas de negocio: edad y descuento por edad", () => {
  it("calcula la edad considerando si ya cumplió años este año", () => {
    expect(calcularEdad("1976-10-10", HOY)).toBe(50);   
    expect(calcularEdad("1976-10-11", HOY)).toBe(49);   
  });

  it("devuelve null cuando no hay fecha válida", () => {
    expect(calcularEdad("", HOY)).toBeNull();
    expect(calcularEdad("no-es-fecha", HOY)).toBeNull();
  });

  it("aplica el descuento 50% solo desde los 50 años", () => {
    expect(califica50("1976-10-10", HOY)).toBe(true);
    expect(califica50("1980-01-01", HOY)).toBe(false);
    expect(califica50("", HOY)).toBe(false);
  });
});

describe("Reglas de negocio: correos y contraseñas", () => {
  it("reconoce correos institucionales Duoc", () => {
    expect(esCorreoDuoc("alumno@duoc.cl")).toBe(true);
    expect(esCorreoDuoc("profe@profesor.duoc.cl")).toBe(true);
    expect(esCorreoDuoc("persona@gmail.com")).toBe(false);
  });

  it("solo permite los dominios configurados", () => {
    expect(correoPermitido("ana@gmail.com")).toBe(true);
    expect(correoPermitido("ana@hotmail.com")).toBe(false);
    expect(correoPermitido("ANA@DUOC.CL")).toBe(true);
  });

  it("exige contraseñas de entre 8 y 10 caracteres", () => {
    expect(contrasenaValida("12345678")).toBe(true);
    expect(contrasenaValida("1234567")).toBe(false);
    expect(contrasenaValida("12345678901")).toBe(false);
  });
});

describe("Reglas de negocio: precios y totales", () => {
  it("aplica el porcentaje de oferta al precio unitario", () => {
    expect(precioUnitario(productos[1])).toBe(4400);
    expect(precioUnitario(productos[0])).toBe(45000);
  });

  it("sin sesión no aplica ningún beneficio", () => {
    const r = calcularTotales([{ codigo: "TC001", cantidad: 1 }], productos, null, HOY);
    expect(r.subtotal).toBe(45000);
    expect(r.total).toBe(45000);
    expect(r.totalDescuentos).toBe(0);
  });

  it("regala una torta de cumpleaños a cuentas Duoc que la tengan en el carrito", () => {
    const usuario = { correo: "alumno@duoc.cl", fechaNacimiento: "", codigoFelices50Aplicado: false };
    const r = calcularTotales([{ codigo: CODIGO_TORTA_DUOC, cantidad: 2 }], productos, usuario, HOY);
    expect(r.descuentoTortaDuoc).toBe(55000);
    expect(r.total).toBe(55000); 
  });

  it("no regala la torta a correos que no son Duoc", () => {
    const usuario = { correo: "x@gmail.com", fechaNacimiento: "", codigoFelices50Aplicado: false };
    const r = calcularTotales([{ codigo: CODIGO_TORTA_DUOC, cantidad: 1 }], productos, usuario, HOY);
    expect(r.descuentoTortaDuoc).toBe(0);
  });

  it("aplica 50% por edad y luego el 10% del código FELICES50 sobre el resto", () => {
    const usuario = { correo: "x@gmail.com", fechaNacimiento: "1970-01-01", codigoFelices50Aplicado: true };
    const r = calcularTotales([{ codigo: "TC001", cantidad: 2 }], productos, usuario, HOY);
    expect(r.subtotal).toBe(90000);
    expect(r.descuentoEdad).toBe(45000);
    expect(r.descuentoCodigo).toBe(Math.round(45000 * DESCUENTO_FELICES50));
    expect(r.total).toBe(90000 - 45000 - 4500);
  });

  it("ignora ítems con cantidad cero o productos inexistentes", () => {
    const r = calcularTotales([{ codigo: "TC001", cantidad: 0 }, { codigo: "NOEXISTE", cantidad: 1 }], productos, null, HOY);
    expect(r.lineas.length).toBe(0);
    expect(r.total).toBe(0);
  });
});

describe("Reglas de negocio: stock", () => {
  it("detecta productos sin stock suficiente", () => {
    const problemas = validarStock([{ codigo: "TE001", cantidad: 6 }], productos);
    expect(problemas.length).toBe(1);
    expect(problemas[0].motivo).toContain("5");
  });

  it("no reporta problemas cuando hay stock", () => {
    expect(validarStock([{ codigo: "TC001", cantidad: 12 }], productos).length).toBe(0);
  });

  it("marca stock crítico cuando baja o iguala el umbral", () => {
    expect(esStockCritico({ stock: 3, stockCritico: 3 })).toBe(true);
    expect(esStockCritico({ stock: 4, stockCritico: 3 })).toBe(false);
  });
});
