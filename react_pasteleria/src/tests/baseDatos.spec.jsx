import * as bd from "../data/baseDatos.js";

describe("Base de datos simulada (CRUD)", () => {
  beforeEach(() => {
    bd.reiniciarBaseDatos();
  });

  it("lista los productos de partida", () => {
    expect(bd.listar("productos").length).toBe(10);
  });

  it("obtiene un registro por su identificador", () => {
    expect(bd.obtener("productos", "TC001").nombre).toContain("Chocolate");
    expect(bd.obtener("productos", "XX999")).toBeNull();
  });

  it("crea un registro nuevo y lo persiste en localStorage", () => {
    bd.crear("productos", { codigo: "NEW01", nombre: "Nueva", precio: 1000, stock: 2, categoria: "Tortas Especiales" });
    expect(bd.obtener("productos", "NEW01").precio).toBe(1000);
    const guardado = JSON.parse(localStorage.getItem("milSaboresBD"));
    expect(guardado.productos.some((p) => p.codigo === "NEW01")).toBe(true);
  });

  it("no permite crear dos registros con el mismo identificador", () => {
    expect(() => bd.crear("productos", { codigo: "TC001", nombre: "Duplicada" })).toThrow(/Ya existe/);
  });

  it("actualiza campos de un registro sin tocar los demás", () => {
    const actualizado = bd.actualizar("productos", "TC001", { stock: 99 });
    expect(actualizado.stock).toBe(99);
    expect(actualizado.nombre).toBe("Torta Cuadrada de Chocolate");
  });

  it("lanza error al actualizar un registro inexistente", () => {
    expect(() => bd.actualizar("productos", "NOPE", { stock: 1 })).toThrow(/No existe/);
  });

  it("elimina un registro existente y devuelve false si no existe", () => {
    expect(bd.eliminar("productos", "TC001")).toBe(true);
    expect(bd.obtener("productos", "TC001")).toBeNull();
    expect(bd.eliminar("productos", "TC001")).toBe(false);
  });

  it("notifica a los suscriptores cuando cambian los datos", () => {
    const aviso = vi.fn();
    const quitar = bd.suscribirse(aviso);
    bd.actualizar("productos", "PI001", { stock: 1 });
    expect(aviso).toHaveBeenCalled();
    quitar();
  });

  it("devuelve copias: modificar un resultado no altera la base de datos", () => {
    const copia = bd.obtener("productos", "TC001");
    copia.stock = 0;
    expect(bd.obtener("productos", "TC001").stock).toBe(12);
  });
});
