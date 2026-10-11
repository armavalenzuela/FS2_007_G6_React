// Mensaje reutilizable (éxito o error)
export default function Alerta({ tipo = "success", children }) {
  if (!children) return null;
  return <div className={`alert alert-${tipo} small mt-3 mb-0`} role="alert">{children}</div>;
}
