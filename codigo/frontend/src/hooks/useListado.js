import { useCallback, useEffect, useState } from "react";
import API from "../config/api";

// ruta: por ejemplo "/noticias"; limite: cuántos traer (sin límite, todos)
export default function useListado(ruta, limite) {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setError("");
    setCargando(true);

    try {
      const respuesta = await fetch(`${API}${ruta}`);
      const texto = await respuesta.text();
      let datos = [];

      try {
        datos = texto ? JSON.parse(texto) : [];
      } catch {
        throw new Error("El servidor devolvió una respuesta inválida.");
      }

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo cargar el contenido.");
      }

      const lista = Array.isArray(datos) ? datos : [];
      setItems(limite ? lista.slice(0, limite) : lista);
    } catch (e) {
      setError(e.message || "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }, [ruta, limite]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { items, cargando, error, recargar: cargar };
}