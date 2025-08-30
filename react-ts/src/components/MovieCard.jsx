import { Link } from "react-router-dom";

export function MovieCard({ item }) {
  const { imdbID, Title, Poster, ubication, Year, Type } = item;
  return (
    <Link
      to={`/movie/${imdbID}`}
      state={{ item }}                // 👈 pasamos el objeto completo (rápido)
      className="card"
    >
      <div className="poster-wrap">
        {Poster ? <img className="poster" src={Poster} alt={`Poster de ${Title}`} loading="lazy" />
                 : <div className="poster placeholder">Sin póster</div>}
      </div>
      <div className="card-body">
        <h3 className="title">{Title}</h3>
        <p className="meta">
          {Year && <span>{Year}</span>}
          {Type && <><span className="dot">•</span><span>{Type}</span></>}
        </p>
        {ubication && <p className="tag">{ubication}</p>}
      </div>
    </Link>
  );
}
