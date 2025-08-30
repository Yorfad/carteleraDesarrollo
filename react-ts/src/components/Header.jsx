// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Header({ filters, setFilters, ubicaciones }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* Marca */}
        <h1 className="brand">
          <Link to="/">CineYair</Link>
        </h1>

        {/* Filtros */}
        <form className="header-filters" onSubmit={(e) => e.preventDefault()}>
          <input
            className="input"
            placeholder="Buscar por título…"
            value={filters.title}
            onChange={(e) => setFilters(f => ({ ...f, title: e.target.value }))}
          />
          <select
            className="select"
            value={filters.ubication}
            onChange={(e) => setFilters(f => ({ ...f, ubication: e.target.value }))}
          >
            {ubicaciones.map((u, i) => (
              <option key={i} value={u}>
                {u === "" ? "Todas las ubicaciones" : u}
              </option>
            ))}
          </select>
        </form>

        {/* Sesión */}
        <nav className="header-auth">
          {!user ? (
            <Link className="btn" to="/login">Iniciar sesión</Link>
          ) : (
            <>
              <span className="header-hello">Hola, {user.username}</span>
              <button
                type="button"
                className="btn"
                onClick={() => logout()}
                title="Cerrar sesión"
              >
                Cerrar sesión
              </button>
              {user.role === "admin" && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => navigate("/admin")}
                >
                  Admin
                </button>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
