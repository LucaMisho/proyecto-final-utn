import { useCallback, useEffect, useState } from "react";
import API from "../config/api";

// limite: cuántas novedades traer; sin limite devuelve todas
export default function useNovedades(limite) {
  const [novedades, setNovedades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setError("");
    setCargando(true);

    try {
      const respuesta = await fetch(`${API}/novedades`);
      const texto = await respuesta.text();
      let datos = [];

      try {
        datos = texto ? JSON.parse(texto) : [];
      } catch {
        throw new Error("El servidor devolvió una respuesta inválida.");
      }

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudieron cargar las novedades.");
      }

      const lista = Array.isArray(datos) ? datos : [];
      setNovedades(limite ? lista.slice(0, limite) : lista);
    } catch (e) {
      setError(e.message || "No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }, [limite]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { novedades, cargando, error, recargar: cargar };
}