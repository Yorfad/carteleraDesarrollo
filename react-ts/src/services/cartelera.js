// Construye siempre la URL con ambas keys (title, ubication).
// Si están vacías, el backend devuelve toda la cartelera.
export async function getCartelera({ title = '', ubication = '' } = {}) {
  const params = new URLSearchParams({
    title: title ?? '',
    ubication: ubication ?? ''
  });

  const url = `https://movie.azurewebsites.net/api/cartelera?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}
