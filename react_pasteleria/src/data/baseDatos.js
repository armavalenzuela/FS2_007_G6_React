const CLAVE_BD = "milSaboresBD";

// Campo para identificar de forma única a cada registro de cada colección
export const CAMPO_ID = {
  productos: "codigo",
  usuarios: "correo",
  pedidos: "numero",
  contactos: "id",
};

// Datos de partida para reutilizacion en pruebas y administracion
const DATOS_INICIALES = {
  productos: [
    { codigo: "TC001", categoria: "Tortas Cuadradas", tipo: "cuadrada", nombre: "Torta Cuadrada de Chocolate", precio: 45000, stock: 12, stockCritico: 3, descripcion: "Torta de chocolate con capas de ganache y un toque de avellanas.", enOferta: false, descuentoOferta: 0, imagen: "assets/img/productos/TC001.jpg" },
    { codigo: "TC002", categoria: "Tortas Cuadradas", tipo: "cuadrada", nombre: "Torta Cuadrada de Frutas", precio: 50000, stock: 8, stockCritico: 3, descripcion: "Frutas frescas y crema chantilly sobre bizcocho de vainilla.", enOferta: true, descuentoOferta: 10, imagen: "assets/img/productos/TC002.jpg" },
    { codigo: "TT001", categoria: "Tortas Circulares", tipo: "circular", nombre: "Torta Circular de Vainilla", precio: 40000, stock: 15, stockCritico: 4, descripcion: "Bizcocho de vainilla relleno con crema pastelera.", enOferta: false, descuentoOferta: 0, imagen: "assets/img/productos/TT001.jpg" },
    { codigo: "TT002", categoria: "Tortas Circulares", tipo: "circular", nombre: "Torta Circular de Manjar", precio: 42000, stock: 10, stockCritico: 3, descripcion: "Torta tradicional chilena con manjar y nueces.", enOferta: true, descuentoOferta: 15, imagen: "assets/img/productos/TT002.jpg" },
    { codigo: "PI001", categoria: "Postres Individuales", tipo: "individual", nombre: "Mousse de Chocolate", precio: 5000, stock: 30, stockCritico: 5, descripcion: "Postre individual cremoso, hecho con chocolate de alta calidad.", enOferta: false, descuentoOferta: 0, imagen: "assets/img/productos/PI001.jpg" },
    { codigo: "PI002", categoria: "Postres Individuales", tipo: "individual", nombre: "Tiramisú Clásico", precio: 5500, stock: 25, stockCritico: 5, descripcion: "Postre italiano con capas de café, mascarpone y cacao.", enOferta: true, descuentoOferta: 20, imagen: "assets/img/productos/PI002.jpg" },
    { codigo: "PT001", categoria: "Pastelería Tradicional", tipo: "tradicional", nombre: "Empanada de Manzana", precio: 3000, stock: 40, stockCritico: 8, descripcion: "Pastelería tradicional rellena de manzanas especiadas.", enOferta: false, descuentoOferta: 0, imagen: "assets/img/productos/PT001.jpg" },
    { codigo: "PT002", categoria: "Pastelería Tradicional", tipo: "tradicional", nombre: "Tarta de Santiago", precio: 6000, stock: 20, stockCritico: 4, descripcion: "Tradicional tarta española con almendras y azúcar.", enOferta: false, descuentoOferta: 0, imagen: "assets/img/productos/PT002.jpg" },
    { codigo: "PV001", categoria: "Productos Vegana", tipo: "circular", nombre: "Torta Vegana de Chocolate", precio: 50000, stock: 6, stockCritico: 2, descripcion: "Torta de chocolate húmeda, sin productos de origen animal.", enOferta: false, descuentoOferta: 0, imagen: "assets/img/productos/PV001.jpg" },
    { codigo: "TE001", categoria: "Tortas Especiales", tipo: "circular", nombre: "Torta Especial de Cumpleaños", precio: 55000, stock: 5, stockCritico: 2, descripcion: "Diseñada para celebraciones, personalizable con mensajes.", enOferta: false, descuentoOferta: 0, imagen: "assets/img/productos/TE001.jpg" },
  ],
  usuarios: [
    { nombre: "Admin", correo: "admin@duoc.cl", contrasena: "admin123", tipo: "administrador", fechaNacimiento: "", telefono: "", codigoFelices50Aplicado: false },
    { nombre: "Vendedor", correo: "vendedor@duoc.cl", contrasena: "vendedor1", tipo: "vendedor", fechaNacimiento: "", telefono: "", codigoFelices50Aplicado: false },
    { nombre: "Armando", correo: "armando@gmail.com", contrasena: "armand123", tipo: "cliente", fechaNacimiento: "", telefono: "", codigoFelices50Aplicado: false },
    { nombre: "Sebastian", correo: "sebastian@gmail.com", contrasena: "sebas123", tipo: "cliente", fechaNacimiento: "", telefono: "", codigoFelices50Aplicado: false },
    { nombre: "Juan", correo: "juan@duoc.cl", contrasena: "juan12345", tipo: "cliente", fechaNacimiento: "", telefono: "", codigoFelices50Aplicado: false },
  ],
  pedidos: [],
  contactos: [],
};

function copiaProfunda(valor) {
  return JSON.parse(JSON.stringify(valor));
}

function leerDesdeAlmacenamiento() {
  try {
    const guardado = localStorage.getItem(CLAVE_BD);
    if (guardado) return JSON.parse(guardado);
  } catch (error) {
    // Si el JSON guardado esta dañado, se usan los datos iniciales
  }
  return copiaProfunda(DATOS_INICIALES);
}


let estado = leerDesdeAlmacenamiento();
const suscriptores = new Set();

function guardar(nuevoEstado) {
  estado = nuevoEstado;
  try {
    localStorage.setItem(CLAVE_BD, JSON.stringify(estado));
  } catch (error) {
    // Almacenamiento lleno o no disponible: el estado sigue en memoria
  }
  suscriptores.forEach((notificar) => notificar());
}

// ---------- Suscripción (usada por los hooks de React) ----------
export function suscribirse(notificar) {
  suscriptores.add(notificar);
  return () => suscriptores.delete(notificar);
}

export function obtenerEstado() {
  return estado;
}

// ---------- CRUD genérico ----------
export function listar(coleccion) {
  return copiaProfunda(estado[coleccion] || []);
}

export function obtener(coleccion, id) {
  const campo = CAMPO_ID[coleccion];
  const encontrado = (estado[coleccion] || []).find((registro) => registro[campo] === id);
  return encontrado ? copiaProfunda(encontrado) : null;
}

export function crear(coleccion, datos) {
  const campo = CAMPO_ID[coleccion];
  const registros = estado[coleccion] || [];
  const nuevo = copiaProfunda(datos);
  if (campo === "id" && nuevo.id === undefined) {
    nuevo.id = `${coleccion}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  if (registros.some((registro) => registro[campo] === nuevo[campo])) {
    throw new Error(`Ya existe un registro con ${campo} "${nuevo[campo]}"`);
  }
  guardar({ ...estado, [coleccion]: [...registros, nuevo] });
  return copiaProfunda(nuevo);
}

export function actualizar(coleccion, id, cambios) {
  const campo = CAMPO_ID[coleccion];
  const registros = estado[coleccion] || [];
  if (!registros.some((registro) => registro[campo] === id)) {
    throw new Error(`No existe el registro ${id} en ${coleccion}`);
  }
  const nuevosRegistros = registros.map((registro) =>
    registro[campo] === id ? { ...registro, ...copiaProfunda(cambios) } : registro
  );
  guardar({ ...estado, [coleccion]: nuevosRegistros });
  return obtener(coleccion, id);
}

export function eliminar(coleccion, id) {
  const campo = CAMPO_ID[coleccion];
  const registros = estado[coleccion] || [];
  const nuevosRegistros = registros.filter((registro) => registro[campo] !== id);
  if (nuevosRegistros.length === registros.length) return false;
  guardar({ ...estado, [coleccion]: nuevosRegistros });
  return true;
}

// Restaura los datos de partida (útil para pruebas y para el administrador)
export function reiniciarBaseDatos() {
  guardar(copiaProfunda(DATOS_INICIALES));
}

// Sincroniza cambios hechos en otras pestañas del mismo navegador
if (typeof window !== "undefined") {
  window.addEventListener("storage", (evento) => {
    if (evento.key === CLAVE_BD) {
      estado = leerDesdeAlmacenamiento();
      suscriptores.forEach((notificar) => notificar());
    }
  });
}
