import { useEffect } from "react";

const NOMBRE_SITIO = "Barrio Cultura · Envión-Quequén";

// Cambia el título de la pestaña según la pantalla
export default function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | ${NOMBRE_SITIO}` : NOMBRE_SITIO;
  }, [titulo]);
}
