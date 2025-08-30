// src/components/AdminPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getCartelera } from "../services/cartelera";
import { useNavigate } from "react-router-dom";
import {
  createMovieOnServer,
  updateMovieOnServer,
  deleteMovieOnServer,
} from "../services/adminApi";

// normalizador igual que antes…
function normalize(list) {
  return (Array.isArray(list) ? list : []).map((it) => {
    const ub = it.ubication ?? it.Ubication ?? it.ubicacion ?? it["Ubicación"] ?? "";
    const idRaw = it.imdbID ?? it.imdbId ?? it.ID ?? it.id ?? "";
    const id = String(idRaw || "").trim() || null;
    return { ...it, ubication: ub, imdbID: id, id };
  });
}

const EMPTY_MOVIE = {
  imdbID: "",
  Title: "",
  Year: "",
  Type: "",
  Poster: "",
  Estado: true,
  description: "",
  Ubication: "",
};

export function AdminPage() {
    const navigate = useNavigate(); 
  const { user, logout } = useAuth();
  const [movies, setMovies] = useState([]);
  const [mode, setMode] = useState("list"); // 'list' | 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_MOVIE);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    setError("");
    try {
      const r = await getCartelera({ title: "", ubication: "" });
      setMovies(normalize(r));
    } catch (e) {
      setError(e.message || "Error recargando lista");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  const sorted = useMemo(
    () => [...movies].sort((a, b) => String(a.Title||"").localeCompare(String(b.Title||""))),
    [movies]
  );

  // Crear
  const startCreate = () => {
    setForm(EMPTY_MOVIE);
    setEditingId(null);
    setMode("create");
    setStatus(""); setError("");
  };

  // Editar
  const startEdit = (m) => {
    setForm({
      imdbID: m.imdbID || "",
      Title: m.Title || "",
      Year: m.Year || "",
      Type: m.Type || "",
      Poster: m.Poster || "",
      Estado: !!m.Estado,
      description: m.description || "",
      Ubication: m.ubication || m.Ubication || "",
    });
    setEditingId(m.imdbID || m.id);
    setMode("edit");
    setStatus(""); setError("");
  };

  const cancelForm = () => {
    setMode("list");
    setEditingId(null);
    setForm(EMPTY_MOVIE);
    setStatus(""); setError("");
  };

  // Guardar (create/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(mode === "create" ? "Guardando…" : "Actualizando…");
    setError("");

    try {
      if (mode === "create") {
        await createMovieOnServer(form);
        setStatus("Película creada.");
      } else {
        await updateMovieOnServer(editingId, form); 
      setStatus("Película actualizada.");
      }
      await reload();           // ← refresca desde la API
      cancelForm();             // ← vuelve a la lista
    } catch (err) {
      console.error(err);
      setError(err.message || "Error guardando");
      setStatus("");
    }
  };


    const handleDelete = async (m) => {
    if (!confirm(`¿Eliminar "${m.Title}" en "${m.ubication || m.Ubication}"?`)) return;
    setStatus("Eliminando…"); setError("");
    try {
        await deleteMovieOnServer({ id: m.imdbID || m.id, ubication: m.ubication || m.Ubication });
        setStatus("Película eliminada.");
        await reload();
    } catch (err) {
        setError(err.message || "Error eliminando");
        setStatus("");
    }
    };



  // --------- render ----------
  if (loading) return <div className="app-container"><p className="status">Cargando…</p></div>;
  if (error)   return <div className="app-container"><p className="status error">⚠️ {error}</p></div>;
    
  return (
    <div className="app-container">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
        <h2>Panel de administración</h2>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span>Hola, {user?.username} ({user?.role})</span>
          <button className="button" onClick={logout}>Salir</button>
        </div>
      </div>

      <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Volver</button>

      {status && <p className="status">{status}</p>}

      {mode === "list" && (
        <>
          <div style={{ display:"flex", justifyContent:"flex-end", margin:"10px 0" }}>
            <button className="button" onClick={startCreate}>+ Nueva película</button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>imdbID</th>
                  <th>Título</th>
                  <th>Año</th>
                  <th>Tipo</th>
                  <th>Ubicación</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((m) => (
                  <tr key={m.imdbID ?? m.id ?? m.Title}>
                    <td>{m.imdbID || "-"}</td>
                    <td>{m.Title}</td>
                    <td>{m.Year || "-"}</td>
                    <td>{m.Type || "-"}</td>
                    <td>{m.ubication || "-"}</td>
                    <td>{m.Estado ? "Disponible" : "No"}</td>
                    <td style={{ whiteSpace:"nowrap" }}>
                      <button className="button" onClick={() => startEdit(m)}>Editar</button>{" "}
                      <button className="button" onClick={() => handleDelete(m)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {mode !== "list" && (
        <form onSubmit={handleSubmit} className="admin-form" style={{ marginTop:16 }}>
          <h3>{mode === "create" ? "Nueva película" : `Editar: ${editingId}`}</h3>

          <input required placeholder="imdbID"
                 value={form.imdbID}
                 onChange={e=>setForm(f=>({ ...f, imdbID: e.target.value }))} 
                 disabled={mode === "edit"}  />
          <input required placeholder="Title"
                 value={form.Title}
                 onChange={e=>setForm(f=>({ ...f, Title: e.target.value }))} />
          <input placeholder="Year"
                 value={form.Year}
                 onChange={e=>setForm(f=>({ ...f, Year: e.target.value }))} />
          <input placeholder="Type"
                 value={form.Type}
                 onChange={e=>setForm(f=>({ ...f, Type: e.target.value }))} />
          <input placeholder="Poster URL"
                 value={form.Poster}
                 onChange={e=>setForm(f=>({ ...f, Poster: e.target.value }))} />
          <label style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input type="checkbox"
                   checked={form.Estado}
                   onChange={e=>setForm(f=>({ ...f, Estado: e.target.checked }))} />
            Disponible
          </label>
          <input placeholder="Ubication"
                 value={form.Ubication}
                 onChange={e=>setForm(f=>({ ...f, Ubication: e.target.value }))}
                 disabled={mode === "edit"} />
          <textarea placeholder="description"
                    value={form.description}
                    onChange={e=>setForm(f=>({ ...f, description: e.target.value }))} />

          <div style={{ display:"flex", gap:8 }}>
            <button className="button" type="submit">
              {mode === "create" ? "Guardar" : "Actualizar"}
            </button>
            <button className="button" type="button" onClick={cancelForm}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}
