// src/components/MovieModal.jsx
import { useMemo } from "react";

export function MovieModal({ item, onClose, allData }) {
  const { Title, Poster, Year, Type, description } = item;

  // Otras ubicaciones donde aparece el mismo título (según allData)
  const ubicaciones = useMemo(() => {
    const sameTitle = allData.filter(x => (x.Title || "").trim() === (Title || "").trim());
    const set = new Set(sameTitle.map(x => x.ubication).filter(Boolean));
    return Array.from(set);
  }, [allData, Title]);

  // Horarios "placeholder" (UI listo, no vienen de la API)
  const horariosDemo = ["12:00", "15:00", "18:00", "21:00"];

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>

        <div className="modal-header">
          <div className="modal-poster">
            {Poster ? <img src={Poster} alt={`Póster de ${Title}`} /> : <div className="poster placeholder">Sin póster</div>}
          </div>
          <div className="modal-main">
            <h2 className="modal-title">{Title}</h2>
            <p className="meta">
              {Year && <span>{Year}</span>}
              {Type && <><span className="dot">•</span><span>{Type}</span></>}
            </p>
            {description && <p className="desc">{description}</p>}
          </div>
        </div>

        <div className="modal-section">
          <h3>Disponibilidad por sede</h3>
          {ubicaciones.length ? (
            <ul className="chips">
              {ubicaciones.map(u => <li key={u} className="chip">{u}</li>)}
            </ul>
          ) : (
            <p className="muted">La API no reporta más sedes para este título.</p>
          )}
        </div>

        <div className="modal-section">
          <h3>Horarios</h3>
          <ul className="chips">
            {horariosDemo.map(h => <li key={h} className="chip">{h}</li>)}
          </ul>
          <p className="muted">* Horarios mostrados como ejemplo (la API no provee horarios).</p>
        </div>

        <div className="modal-actions">
          <button className="button" disabled title="No disponible: la API no expone compra">
            Comprar boleto
          </button>
        </div>
      </div>
    </div>
  );
}
