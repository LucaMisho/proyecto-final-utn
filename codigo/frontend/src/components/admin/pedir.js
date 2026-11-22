import API from "../../config/api";

export class ErrorDeSesion extends Error {}

// Hace un pedido a la API con el token y devuelve los datos o lanza un error con el mensaje del servidor
export async function pedir(ruta, { metodo = "GET", cuerpo, token } = {}) {
  let respuesta;

  // Con FormData (archivos) el navegador pone el Content-Type con su boundary
  const esFormData = cuerpo instanceof FormData;

  try {
    respuesta = await fetch(`${API}/${ruta}`, {
      method: metodo,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(cuerpo && !esFormData ? { "Content-Type": "application/json" } : {}),
      },
      body: cuerpo ? (esFormData ? cuerpo : JSON.stringify(cuerpo)) : undefined,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (respuesta.status === 401) {
    throw new ErrorDeSesion("Tu sesión venció. Iniciá sesión de nuevo.");
  }

  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudo completar la acción.");
  }

  return datos;
}