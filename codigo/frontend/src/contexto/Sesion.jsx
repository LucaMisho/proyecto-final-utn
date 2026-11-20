import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAvisos } from "./Avisos";

const SesionContexto = createContext(null);

// Lee el vencimiento (exp, en segundos) que trae el token JWT
function leerVencimiento(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const datos = JSON.parse(atob(base64));
    return typeof datos.exp === "number" ? datos.exp * 1000 : null;
  } catch {
    return null;
  }
}

function borrarGuardado() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  } catch {
    // sin almacenamiento disponible
  }
}

// Recupera la sesión guardada si el token todavía no venció
function recuperarSesion() {
  try {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!token || !usuario) return { token: null, usuario: null };

    const vence = leerVencimiento(token);
    if (!vence || vence <= Date.now()) {
      borrarGuardado();
      return { token: null, usuario: null };
    }

    return { token, usuario };
  } catch {
    return { token: null, usuario: null };
  }
}

export function SesionProvider({ children }) {
  const { avisar } = useAvisos();
  const [sesion, setSesion] = useState(recuperarSesion);

  const iniciarSesion = useCallback((token, usuario) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } catch {
      // la sesión sigue funcionando mientras la pestaña esté abierta
    }
    setSesion({ token, usuario });
  }, []);

  const cerrarSesion = useCallback(() => {
    borrarGuardado();
    setSesion({ token: null, usuario: null });
  }, []);

  // Cuando el token vence, se cierra la sesión sola y se avisa
  useEffect(() => {
    if (!sesion.token) return undefined;

    const vence = leerVencimiento(sesion.token);
    if (!vence) return undefined;

    const espera = Math.min(Math.max(vence - Date.now(), 0), 2147483647);

    const temporizador = setTimeout(() => {
      cerrarSesion();
      avisar("Tu sesión venció. Iniciá sesión de nuevo.", "error");
    }, espera);

    return () => clearTimeout(temporizador);
  }, [sesion.token, cerrarSesion, avisar]);

  const valor = useMemo(
    () => ({
      usuario: sesion.usuario,
      token: sesion.token,
      iniciarSesion,
      cerrarSesion,
    }),
    [sesion, iniciarSesion, cerrarSesion]
  );

  return (
    <SesionContexto.Provider value={valor}>{children}</SesionContexto.Provider>
  );
}

export function useSesion() {
  const contexto = useContext(SesionContexto);

  if (!contexto) {
    throw new Error("useSesion se usa dentro de SesionProvider");
  }

  return contexto;
}
