import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if (res.ok) {
      nav(state?.from ?? "/");
    } else {
      setError(res.error || "Error de inicio de sesión");
    }
  };

  return (
    <div className="app-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit} className="login-form">
        <input
          placeholder="Usuario (admin / user)"
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
        />
        <input
          placeholder="Contraseña (1234)"
          type="password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
        />
        <button className="button" type="submit">Entrar</button>
        {error && <p className="status error">{error}</p>}
      </form>
      <p className="muted">Admin: <code>admin / 1234</code>. Usuario: <code>user / 1234</code>.</p>
      <p><Link to="/">Volver a cartelera</Link></p>
    </div>
  );
}
