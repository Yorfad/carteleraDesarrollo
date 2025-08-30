import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { username, role }

  useEffect(() => {
    const raw = localStorage.getItem("cineyair:user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = async ({ username, password }) => {
    // DEMO: credenciales fijas; cambia por tu API cuando exista
    if (username === "admin" && password === "1234") {
      const u = { username, role: "admin" };
      setUser(u);
      localStorage.setItem("cineyair:user", JSON.stringify(u));
      return { ok: true };
    }
    if (username === "user" && password === "1234") {
      const u = { username, role: "user" };
      setUser(u);
      localStorage.setItem("cineyair:user", JSON.stringify(u));
      return { ok: true };
    }
    return { ok: false, error: "Credenciales inválidas" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cineyair:user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
