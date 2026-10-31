
const API_URL = "http://localhost:8000";

function obtenerTokenCSRF() {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith("XSRF-TOKEN="));

  return cookie
    ? decodeURIComponent(cookie.split("=").slice(1).join("="))
    : "";
}

export async function apiFetch(ruta, opciones = {}) {
  const metodo = (opciones.method || "GET").toUpperCase();

  if (!["GET", "HEAD", "OPTIONS"].includes(metodo)) {
    await fetch(`${API_URL}/sanctum/csrf-cookie`, {
      credentials: "include",
    });
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(opciones.body ? { "Content-Type": "application/json" } : {}),
      ...opciones.headers,
      ...(!["GET", "HEAD", "OPTIONS"].includes(metodo)
        ? { "X-XSRF-TOKEN": obtenerTokenCSRF() }
        : {}),
    },
  });

  return respuesta;
}
