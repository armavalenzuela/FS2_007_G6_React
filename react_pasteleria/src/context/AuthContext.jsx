import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { authService } from "../services/authService";

const CLAVE_TOKEN = "pasteleriaToken";
const AuthContext = createContext(null);

function leerToken() {
  return sessionStorage.getItem(CLAVE_TOKEN);
}

function decodificar(token) {
  if (!token) return null;
  try {
    const payloadBase64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(payloadBase64), (caracter) => caracter.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    return { correo: payload.sub, rol: payload.role, exp: payload.exp };
  } catch (error) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(leerToken);
  const usuario = useMemo(() => {
    const d = decodificar(token);
    if (!d) return null;
    return { correo: d.correo, rol: d.rol };
  }, [token]);
  const timerRef = useRef(null);

  useEffect(() => {
    sessionStorage.removeItem("ultimoPedidoMilSabores");
  }, []);

  function guardarToken(nuevoToken) {
    if (nuevoToken) sessionStorage.setItem(CLAVE_TOKEN, nuevoToken);
    else sessionStorage.removeItem(CLAVE_TOKEN);
    setToken(nuevoToken);
  }

  // Renovacion automatica del JWT antes de que expire.
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const d = decodificar(token);
    if (!d || !d.exp) return;
    const msHastaExpiracion = d.exp * 1000 - Date.now();
    const msAntes = Math.max(msHastaExpiracion - 60000, 1000); // 1 min antes
    timerRef.current = setTimeout(async () => {
      try {
        const r = await authService.refresh();
        if (r?.token && leerToken() === token) guardarToken(r.token);
      } catch (e) {
        if (leerToken() === token) guardarToken(null);
      }
    }, msAntes);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [token]);

  async function login(correo, contrasena) {
    const respuesta = await authService.login(correo, contrasena);
    guardarToken(respuesta.token);
    return respuesta;
  }

  async function refresh() {
    if (!token) return null;
    const respuesta = await authService.refresh();
    if (respuesta?.token && leerToken() === token) guardarToken(respuesta.token);
    return respuesta;
  }

  function logout() {
    guardarToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return contexto;
}
