import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

const CLAVE_TOKEN = "pasteleriaToken";
const AuthContext = createContext(null);

function leerToken() {
  return sessionStorage.getItem(CLAVE_TOKEN);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(leerToken);

  const usuario = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { correo: payload.sub, rol: payload.role };
    } catch (error) {
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (token) sessionStorage.setItem(CLAVE_TOKEN, token);
    else sessionStorage.removeItem(CLAVE_TOKEN);
  }, [token]);

  async function login(correo, contrasena) {
    const respuesta = await authService.login(correo, contrasena);
    setToken(respuesta.token);
    return respuesta;
  }

  function logout() {
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return contexto;
}
