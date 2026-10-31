import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(() => {
    return Boolean(localStorage.getItem("expense-token"));
  });

  // Comprobar si existe una sesión al iniciar la aplicación.
  useEffect(() => {
    const token = localStorage.getItem("expense-token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    const verifySession = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("expense-token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  // Registrar un usuario.
  const register = async (credentials) => {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  };

  // Iniciar sesión.
  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    const token = response.data.access_token;
    localStorage.setItem("expense-token", token);

    try {
      const userResponse = await api.get("/auth/me");
      setUser(userResponse.data);
      return userResponse.data;
    } catch (error) {
      localStorage.removeItem("expense-token");
      setUser(null);

      throw error;
    }
  };

  // Cerrar sesión.
  const logout = () => {
    localStorage.removeItem("expense-token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, isLoading, register, login, logout,}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
  }

  return context;
}