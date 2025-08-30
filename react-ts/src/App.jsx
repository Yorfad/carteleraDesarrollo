import { useEffect, useMemo, useState } from "react";
import { getCartelera } from "./services/cartelera";
import { Header } from "./components/header";
import { MoviesGrid } from "./components/MoviesGrid";
import { MovieCarousel } from "./components/MovieCarousel";
import { MovieCard } from "./components/MovieCard";
import { Footer } from "./components/Footer";
import "./styles.css";
import "./index.css";

function normalize(list) {
  return (Array.isArray(list) ? list : []).map(it => ({
    ...it,
    ubication: it.ubication ?? it.Ubication ?? it.ubicacion ?? it["Ubicación"] ?? ""
  }));
}

export default function App() {
  const [filters, setFilters] = useState({ title: "", ubication: "" });
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // carga inicial: todo
  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        const r = await getCartelera({ title: "", ubication: "" }, { signal: ctrl.signal });
        const norm = normalize(r);
        setAllData(norm);
        setData(norm);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Error inicial");
      }
    })();
    return () => ctrl.abort();
  }, []);

  // llamadas cuando cambien filtros
  useEffect(() => {
    const bothEmpty = !filters.title && !filters.ubication;
    if (bothEmpty) { setData(allData); return; }

    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError("");
        const r = await getCartelera(filters, { signal: ctrl.signal });
        setData(normalize(r));
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [filters.title, filters.ubication, allData]);

  const ubicaciones = useMemo(() => {
    const set = new Set(allData.map(x => (x.ubication || "").trim()).filter(Boolean));
    return ["", ...Array.from(set)];
  }, [allData]);

  return (
      <>
        <Header filters={filters} setFilters={setFilters} ubicaciones={ubicaciones} />

          <div className="app-container">
              <MovieCarousel
                items={data.filter(m => m.Estado)}   // solo las que tengan Estado=true
                renderItem={(item) => <MovieCard item={item} />}
                title="En cartelera hoy"
              />

            {loading && <p className="status">Cargando…</p>}
            {error && !loading && <p className="status error">⚠️ {error}</p>}
            {!loading && !error && <MoviesGrid data={data} />}
          </div>

          <Footer />
      </>
    );
    
}
