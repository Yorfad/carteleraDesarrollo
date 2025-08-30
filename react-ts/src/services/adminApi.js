const BASE = "https://movie.azurewebsites.net/api/cartelera";

async function fetchWithBetterErrors(url, options) {
  const res = await fetch(url, options);
  const bodyText = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${bodyText || res.statusText}`);
  try {
    return JSON.parse(bodyText);
  } catch {
    return bodyText || null;
  }
}

// ✅ Crear (ya te funciona)
export async function createMovieOnServer(movie) {
  const payload = {
    imdbID: String(movie.imdbID ?? "").trim(),
    Title: movie.Title ?? "",
    Year: movie.Year ?? "",
    Type: movie.Type ?? "",
    Poster: movie.Poster ?? "",
    Estado: Boolean(movie.Estado),
    description: movie.description ?? "",
    Ubication: movie.Ubication ?? ""
  };
  return fetchWithBetterErrors(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ✏️ actualizar — MISMO método que crear: POST JSON con el imdbID existente
export async function updateMovieOnServer(id, movie) {
    if (!movie.imdbID) throw new Error("No se puede actualizar una película sin un ID.");

  const urlConId = `${BASE}?imdbID=${movie.imdbID}`;
  console.log("PUT a:", urlConId, "con body:", movie);

  const response = await fetch(urlConId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });

  if (!response.ok) {
    let msg = `Error al actualizar: status ${response.status}`;
    try {
      const details = await response.json();
      msg += ` → ${JSON.stringify(details)}`;
    } catch {}
    throw new Error(msg);
  }

  return await response.json(); // si el servidor devuelve algo
}

export async function deleteMovieOnServer({ id, ubication }) {
  const imdbID = String(id ?? "").trim();
  const Ubication = String(ubication ?? "").trim();

  if (!imdbID) throw new Error("Falta imdbID para eliminar.");

  // Variante A: DELETE con id en la ruta
  try {
    return await fetchWithBetterErrors(`${BASE}/${encodeURIComponent(imdbID)}`, {
      method: "DELETE",
    });
  } catch (eA) {
    // Variante B: DELETE con query ?imdbID=...&Ubication=...
    try {
      const q = new URLSearchParams({ imdbID, Ubication }).toString();
      return await fetchWithBetterErrors(`${BASE}?${q}`, { method: "DELETE" });
    } catch (eB) {
      // Variante C: POST con acción (algunos backends legacy)
      try {
        const q = new URLSearchParams({ action: "delete", imdbID, Ubication }).toString();
        return await fetchWithBetterErrors(`${BASE}?${q}`, { method: "POST" });
      } catch (eC) {
        // Deja el error más informativo
        throw new Error(
          `No se pudo eliminar.\nA) ${eA.message}\nB) ${eB.message}\nC) ${eC.message}`
        );
      }
    }
  }
}
