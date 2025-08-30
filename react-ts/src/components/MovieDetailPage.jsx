import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCartelera } from "../services/cartelera";

function normalize(list) {
  return (Array.isArray(list) ? list : []).map(it => ({
    ...it,
    ubication: it.ubication ?? it.Ubication ?? it.ubicacion ?? it["Ubicación"] ?? ""
  }));
}

export function MovieDetailPage() {
  const { id } = useParams();                 // imdbID desde la URL
  const nav = useNavigate();
  const location = useLocation();
  const itemFromState = location.state?.item; // si venimos desde la card

  const [item, setItem] = useState(itemFromState || null);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(!itemFromState);
  const [error, setError] = useState("");

  // Fallback: si no llegó por state, carga toda la cartelera y encuentra por imdbID
  useEffect(() => {
    if (itemFromState) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const r = await getCartelera({ title: "", ubication: "" }, { signal: ctrl.signal });
        const norm = normalize(r);
        setAllData(norm);
        const found = norm.find(x => String(x.imdbID) === String(id));
        if (found) setItem(found);
        else setError("No se encontró la película.");
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [id, itemFromState]);

  // Si sí llegó por state, aún podemos cargar allData para “otras sedes”
  useEffect(() => {
    if (!itemFromState) return;
    (async () => {
      try {
        const r = await getCartelera({ title: "", ubication: "" });
        setAllData(normalize(r));
      } catch { /* opcional */ }
    })();
  }, [itemFromState]);

  const ubicaciones = useMemo(() => {
    if (!item) return [];
    const sameTitle = allData.filter(x => (x.Title || "").trim() === (item.Title || "").trim());
    const set = new Set(sameTitle.map(x => x.ubication).filter(Boolean));
    return Array.from(set);
  }, [allData, item]);

  if (loading) return <div className="detail-page"><p className="status">Cargando…</p></div>;
  if (error)   return <div className="detail-page"><p className="status error">⚠️ {error}</p></div>;
  if (!item)   return null;

  const { Title, Poster, Year, Type, description } = item;
  const horariosDemo = ["12:00", "15:00", "18:00", "21:00"];

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => nav(-1)}>← Volver</button>

      <div className="detail-hero">
        <div className="detail-poster">
          {Poster ? <img src={Poster} alt={`Póster de ${Title}`} />
                  : <div className="poster placeholder">Sin póster</div>}
        </div>
        <div className="detail-info">
          <h1>{Title}</h1>
          <p className="meta">
            {Year && <span>{Year}</span>}
            {Type && <><span className="dot">•</span><span>{Type}</span></>}
          </p>
          {description && <p className="desc">{description}</p>}
        </div>
      </div>

      <section className="detail-section">
        <h3>Disponibilidad por sede</h3>
        {ubicaciones.length ? (
          <ul className="chips">
            {ubicaciones.map(u => <li key={u} className="chip">{u}</li>)}
          </ul>
        ) : (
          <p className="muted">No hay más sedes reportadas por la API.</p>
        )}
      </section>

      <section className="detail-section">
        <h3>Horarios</h3>
        <ul className="chips">
          {horariosDemo.map(h => <li key={h} className="chip">{h}</li>)}
        </ul>
        <p className="muted">* Horarios de ejemplo (la API no provee horarios).</p>
      </section>

      <div className="detail-actions">
        <button className="button" disabled>Comprar boleto</button>
      </div>
    </div>
  );
}
