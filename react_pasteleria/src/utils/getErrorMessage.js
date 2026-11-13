export function getErrorMessage(error) {
  const message = error.response?.data?.message;
  if (typeof message === "string" && message) return message;
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "La API tardó demasiado.";
  }
  if (error.response) return `Error HTTP ${error.response.status}`;
  return "No se pudo contactar a la API. Revisa conexión y CORS.";
}
