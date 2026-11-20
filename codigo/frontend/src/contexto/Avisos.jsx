import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import "../styles/Avisos.css";

const AvisosContexto = createContext(null);

const DURACION = 5000;

export function AvisosProvider({ children }) {
  const [avisos, setAvisos] = useState([]);
  const contador = useRef(0);

  const cerrar = useCallback((id) => {
    setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id));
  }, []);

  const avisar = useCallback(
    (texto, tipo = "info") => {
      contador.current += 1;
      const id = contador.current;

      setAvisos((actuales) => [...actuales, { id, texto, tipo }]);
      setTimeout(() => cerrar(id), DURACION);
    },
    [cerrar]
  );

  const valor = useMemo(() => ({ avisar }), [avisar]);

  return (
    <AvisosContexto.Provider value={valor}>
      {children}

      <div className="avisos" role="status" aria-live="polite">
        {avisos.map((aviso) => (
          <div key={aviso.id} className={`aviso aviso-${aviso.tipo}`}>
            <span>{aviso.texto}</span>

            <button
              type="button"
              className="aviso-cerrar"
              onClick={() => cerrar(aviso.id)}
              aria-label="Cerrar aviso"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </AvisosContexto.Provider>
  );
}

export function useAvisos() {
  const contexto = useContext(AvisosContexto);

  if (!contexto) {
    throw new Error("useAvisos se usa dentro de AvisosProvider");
  }

  return contexto;
}
