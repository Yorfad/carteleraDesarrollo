import { MovieCard } from "./MovieCard";

export function MoviesGrid({ data }) {
  if (!data?.length) return <p className="status">No hay resultados.</p>;
  return (
    <section className="grid">
      {data.map(item => (
        <MovieCard key={item.imdbID ?? item.Title + item.ubication} item={item} />
      ))}
    </section>
  );
}
