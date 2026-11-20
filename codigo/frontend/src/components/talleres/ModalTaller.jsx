import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icono from "./Icono";
import {
  esVerdadero,
  estaDisponible,
  textoEdades,
  textoHorario,
} from "./utilidades";
import "../../styles/ModalTaller.css";

const DURACION_SALIDA = 250; // ms, igual que la animación de salida del CSS

function ModalTaller({ taller, barrio, alCerrar }) {
  const [cerrando, setCerrando] = useState(false);
  const panel = useRef(null);
  const botonCerrar = useRef(null);

  const disponible = estaDisponible(taller.estado);
  const imagen = taller.imagen || taller.imagen_url;
  const inicial = (taller.nombre || "T").charAt(0).toUpperCase();

  // Bloquea el scroll de fondo, maneja Escape y mantiene el foco adentro
  useEffect(() => {
    const elementoPrevio = document.activeElement;
    document.body.classList.add("sin-scroll");
    botonCerrar.current?.focus();

    function manejarTeclas(e) {
      if (e.key === "Escape") {
        setCerrando(true);
        return;
      }

      if (e.key === "Tab" && panel.current) {
        const enfocables = panel.current.querySelectorAll(
          "button, a[href], [tabindex]:not([tabindex='-1'])"
        );
        if (enfocables.length === 0) return;

        const primero = enfocables[0];
        const ultimo = enfocables[enfocables.length - 1];

        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    }

    document.addEventListener("keydown", manejarTeclas);

    return () => {
      document.removeEventListener("keydown", manejarTeclas);
      document.body.classList.remove("sin-scroll");
      elementoPrevio?.focus?.();
    };
  }, []);

  // Deja correr la animación de salida y recién después desmonta
  useEffect(() => {
    if (!cerrando) return;
    const temporizador = setTimeout(alCerrar, DURACION_SALIDA);
    return () => clearTimeout(temporizador);
  }, [cerrando, alCerrar]);

  function cerrar() {
    setCerrando(true);
  }

  function clicEnFondo(e) {
    if (e.target === e.currentTarget) cerrar();
  }

  return createPortal(
    <div
      className={`modal-fondo ${cerrando ? "modal-fondo--saliendo" : ""}`}
      onClick={clicEnFondo}
    >
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-taller-titulo"
        ref={panel}
      >
        <button
          type="button"
          className="modal-cerrar"
          onClick={cerrar}
          aria-label="Cerrar"
          ref={botonCerrar}
        >
          <Icono nombre="cerrar" />
        </button>

        {imagen ? (
          <img src={imagen} alt="" className="modal-imagen" />
        ) : (
          <div className="modal-imagen modal-imagen--vacia" aria-hidden="true">
            {inicial}
          </div>
        )}

        <div className="modal-contenido">
          <span
            className={`taller-estado ${
              disponible
                ? "taller-estado--disponible"
                : "taller-estado--inactivo"
            }`}
          >
            {disponible ? "Disponible" : "Inactivo"}
          </span>

          <h2 id="modal-taller-titulo">{taller.nombre}</h2>

          {taller.descripcion && (
            <p className="modal-descripcion">{taller.descripcion}</p>
          )}

          <dl className="modal-datos">
            {barrio && (
              <div>
                <Icono nombre="pin" />
                <dt>Barrio</dt>
                <dd>{barrio}</dd>
              </div>
            )}

            <div>
              <Icono nombre="calendario" />
              <dt>Días</dt>
              <dd>{taller.dia}</dd>
            </div>

            <div>
              <Icono nombre="reloj" />
              <dt>Horario</dt>
              <dd>{textoHorario(taller)} hs</dd>
            </div>

            <div>
              <Icono nombre="edad" />
              <dt>Edades</dt>
              <dd>{textoEdades(taller.edad_minima, taller.edad_maxima)}</dd>
            </div>

            {taller.cupo ? (
              <div>
                <Icono nombre="personas" />
                <dt>Cupo</dt>
                <dd>{taller.cupo} lugares</dd>
              </div>
            ) : null}

            {esVerdadero(taller.equipo_disponible) && (
              <div>
                <Icono nombre="equipo" />
                <dt>Equipo</dt>
                <dd>Disponible en el taller</dd>
              </div>
            )}
          </dl>

          <p className="modal-nota">
            Las inscripciones las realiza el personal del espacio. Acercate
            para sumarte.
          </p>

          <button type="button" className="modal-boton" onClick={cerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ModalTaller;