
import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../config/api";
import { useSesion } from "../../contexto/Sesion";
import { useAvisos } from "../../contexto/Avisos";
import Reveal from "./Reveal";
import "../../styles/Sugerencias.css";

const LIMITE = 500;

function Sugerencias() {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { usuario, token, cerrarSesion } = useSesion();
  const { avisar } = useAvisos();

  async function manejarEnvio(e) {
    e.preventDefault();

    const mensaje = texto.trim();
    if (!mensaje || enviando) return;

    setEnviando(true);

    try {
      const respuesta = await fetch(`${API}/sugerencias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensaje }),
      });

      if (respuesta.status === 401) {
        cerrarSesion();
        avisar("Tu sesión venció. Iniciá sesión de nuevo.", "error");
        return;
      }

      const datos = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo enviar la sugerencia.");
      }

      avisar("¡Gracias! Recibimos tu sugerencia.", "exito");
      setTexto("");
    } catch (error) {
      avisar(error.message || "No se pudo conectar con el servidor.", "error");
    } finally {
      setEnviando(false);
    }
  }

  return (
    
    <section className="sugerencias banda banda--rosa" id="sugerencias">
      <div className="sugerencias-contenedor">
        <Reveal className="sugerencias-texto">
          <div className="sugerencias-icono" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
              <path d="M9 11h6M9 14h4" />
            </svg>
          </div>
          

          <span className="sugerencias-etiqueta">Participá y compartí</span>
          <h2>¡Tu opinión nos importa!</h2>
          <p>
            Queremos seguir creciendo junto a nuestra comunidad.
            Compartí tus ideas, propuestas o sugerencias para
            mejorar nuestros espacios y actividades.
          </p>
        </Reveal>

<<<<<<< HEAD

        {/* Columna del formulario */}
=======
>>>>>>> 1239fbefcbdb8750fa98aaac735f7c93c0d3b87c
        <Reveal delay={2}>
          {usuario ? (
            <form className="sugerencias-form" onSubmit={manejarEnvio}>
              <label htmlFor="sugerencia">Dejanos tu sugerencia</label>

              <textarea
                id="sugerencia"
                placeholder="Escribí tu idea o propuesta..."
                maxLength={LIMITE}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />

              <div className="sugerencias-pie">
                <span className="sugerencias-contador">
                  {texto.length}/{LIMITE}
                </span>

                <button type="submit" disabled={!texto.trim() || enviando}>
                  {enviando ? "Enviando..." : "Enviar sugerencia"}
                </button>
              </div>
            </form>
            
          ) : (
            
            <div className="sugerencias-form sugerencias-aviso">
              <p>Para enviar una sugerencia necesitás tener una cuenta.</p>

              <div className="sugerencias-aviso-acciones">
                <Link to="/login" className="sugerencias-aviso-enlace">
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="sugerencias-aviso-enlace sugerencias-aviso-enlace--secundario"
                >
                  Crear cuenta
                </Link>
              </div>
              
            </div>
            
          )}
        </Reveal>
      </div>
    </section>
  );
  
}

export default Sugerencias;
