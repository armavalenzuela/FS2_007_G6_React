export default function Alerta({ tipo = "info", children }) {
  if (!children) return null;

  return (
    <div className={`alert alert-${tipo} mt-3`} role="alert">
      {children}
    </div>
  );
}
