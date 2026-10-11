// Formato para pesos chilenos
export function formatoPesos(numero) {
  return "$" + Math.round(Number(numero) || 0).toLocaleString("es-CL");
}
