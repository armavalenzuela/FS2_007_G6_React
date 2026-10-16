
export const DOMINIOS_CORREO_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
export const DOMINIOS_DUOC = ["@duoc.cl", "@profesor.duoc.cl"];
export const CODIGO_FELICES50 = "FELICES50";
export const DESCUENTO_EDAD = 0.5;
export const DESCUENTO_FELICES50 = 0.1;
export const EDAD_MINIMA_DESCUENTO = 50;
export const CODIGO_TORTA_DUOC = "TE001";
export const LARGO_CONTRASENA = { minimo: 8, maximo: 10 };

export function calcularEdad(fechaNacimiento, hoy = new Date()) {
  if (!fechaNacimiento) return null;
  const nacimiento = new Date(fechaNacimiento + "T00:00:00");
  if (isNaN(nacimiento.getTime())) return null;

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoCumple) edad--;
  return edad;
}

export function califica50(fechaNacimiento, hoy = new Date()) {
  const edad = calcularEdad(fechaNacimiento, hoy);
  return edad !== null && edad >= EDAD_MINIMA_DESCUENTO;
}

export function esCorreoDuoc(correo) {
  const normalizado = (correo || "").trim().toLowerCase();
  return DOMINIOS_DUOC.some((dominio) => normalizado.endsWith(dominio));
}

export function correoPermitido(correo) {
  const normalizado = (correo || "").trim().toLowerCase();
  return normalizado.length > 0 && normalizado.length <= 100 &&
    DOMINIOS_CORREO_PERMITIDOS.some((dominio) => normalizado.endsWith(dominio));
}

export function contrasenaValida(contrasena) {
  const largo = (contrasena || "").length;
  return largo >= LARGO_CONTRASENA.minimo && largo <= LARGO_CONTRASENA.maximo;
}

export function precioUnitario(producto) {
  if (producto.enOferta && producto.descuentoOferta > 0) {
    return Math.round(producto.precio * (1 - producto.descuentoOferta / 100));
  }
  return producto.precio;
}


export function calcularTotales(items, productos, usuario = null, hoy = new Date()) {
  const lineas = [];
  let subtotal = 0;

  items.forEach((item) => {
    const producto = productos.find((p) => p.codigo === item.codigo);
    if (!producto || item.cantidad <= 0) return;
    const unitario = precioUnitario(producto);
    const subtotalLinea = unitario * item.cantidad;
    subtotal += subtotalLinea;
    lineas.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precioUnitario: unitario,
      precioLista: producto.precio,
      cantidad: item.cantidad,
      subtotal: subtotalLinea,
    });
  });

  let descuentoTortaDuoc = 0;
  let descuentoEdad = 0;
  let descuentoCodigo = 0;

  if (usuario) {
    const lineaTorta = lineas.find((l) => l.codigo === CODIGO_TORTA_DUOC);
    if (lineaTorta && esCorreoDuoc(usuario.correo)) {
      descuentoTortaDuoc = lineaTorta.precioUnitario;
    }

    const baseTrasTorta = subtotal - descuentoTortaDuoc;
    if (califica50(usuario.fechaNacimiento, hoy)) {
      descuentoEdad = Math.round(baseTrasTorta * DESCUENTO_EDAD);
    }

    if (usuario.codigoFelices50Aplicado) {
      const baseTrasEdad = baseTrasTorta - descuentoEdad;
      descuentoCodigo = Math.round(baseTrasEdad * DESCUENTO_FELICES50);
    }
  }

  const totalDescuentos = descuentoTortaDuoc + descuentoEdad + descuentoCodigo;
  return {
    lineas,
    subtotal,
    descuentoTortaDuoc,
    descuentoEdad,
    descuentoCodigo,
    totalDescuentos,
    total: subtotal - totalDescuentos,
  };
}

export function validarStock(items, productos) {
  const problemas = [];
  items.forEach((item) => {
    const producto = productos.find((p) => p.codigo === item.codigo);
    if (!producto) {
      problemas.push({ codigo: item.codigo, motivo: "Producto no disponible" });
    } else if (item.cantidad > producto.stock) {
      problemas.push({ codigo: item.codigo, motivo: `Solo quedan ${producto.stock} unidades` });
    }
  });
  return problemas;
}

export function esStockCritico(producto) {
  return producto.stock <= (producto.stockCritico ?? 0);
}
