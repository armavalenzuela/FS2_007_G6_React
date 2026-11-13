import { useEffect, useRef, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { auth, signOut } from "./cognito";

export function Login() {
  const [error, setError] = useState("");
  return (
    <>
      <h1>Ingresar a Pastelería</h1>
      {error && <p role="alert">{error}</p>}
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => auth.signinRedirect().catch(() => setError("No se pudo abrir el inicio de sesión."))}
      >
        Iniciar sesión
      </button>
    </>
  );
}

export function LoginCallback() {
  const navigate = useNavigate();
  const task = useRef(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    task.current ??= auth.signinCallback();
    task.current
      .then(() => {
        if (active) navigate("/", { replace: true });
      })
      .catch(() => {
        if (active) setError("No se completó el ingreso.");
      });
    return () => {
      active = false;
    };
  }, [navigate]);
  if (!error) return <p>Completando el ingreso…</p>;
  return (
    <>
      <p role="alert">{error}</p>
      <Link to="/login">Volver</Link>
    </>
  );
}

export function RequireJwt() {
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    auth
      .getUser()
      .then((user) => {
        if (active) setSession(Boolean(user?.access_token && !user.expired));
      })
      .catch(() => {
        if (active) setSession(false);
      });
    return () => {
      active = false;
    };
  }, []);
  if (session === null) return <p>Verificando sesión…</p>;
  if (!session) return <Navigate to="/login" replace />;
  return (
    <>
      {error && <p role="alert">{error}</p>}
      <button
        type="button"
        className="btn btn-outline-secondary mb-3"
        onClick={() => signOut().catch(() => setError("No se pudo cerrar la sesión."))}
      >
        Salir
      </button>
      <Outlet />
    </>
  );
}
