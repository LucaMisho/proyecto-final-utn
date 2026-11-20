import { Children, useEffect, useRef, useState } from "react";
import "../../styles/Deslizador.css";

/**
 * Carrusel de tarjetas controlado por la persona (sin autoplay):
 * se desliza con el dedo o el mouse, con flechas en pantallas grandes
 * y con el teclado. Las flechas solo aparecen si hay algo más para ver.
 *
 * Uso: <Deslizador etiqueta="Noticias"> ...tarjetas... </Deslizador>
 */
function Deslizador({ children, etiqueta = "Lista deslizable" }) {
  const pista = useRef(null);
  const [puedeAtras, setPuedeAtras] = useState(false);
  const [puedeAdelante, setPuedeAdelante] = useState(false);
  const cantidad = Children.count(children);

  useEffect(() => {
    const elemento = pista.current;
    if (!elemento) return;

    function actualizar() {
      setPuedeAtras(elemento.scrollLeft > 4);
      setPuedeAdelante(
        elemento.scrollLeft + elemento.clientWidth < elemento.scrollWidth - 4
      );
    }

    actualizar();
    elemento.addEventListener("scroll", actualizar, { passive: true });

    let observador;
    if ("ResizeObserver" in window) {
      observador = new ResizeObserver(actualizar);
      observador.observe(elemento);
    }

    return () => {
      elemento.removeEventListener("scroll", actualizar);
      if (observador) observador.disconnect();
    };
  }, [cantidad]);

  function mover(direccion) {
    const elemento = pista.current;
    if (!elemento) return;

    const sinMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    elemento.scrollBy({
      left: direccion * elemento.clientWidth * 0.85,
      behavior: sinMovimiento ? "auto" : "smooth",
    });
  }

  return (
    <div className="deslizador">
      <button
        type="button"
        className={`deslizador-flecha deslizador-flecha--atras ${
          puedeAtras ? "" : "deslizador-flecha--oculta"
        }`}
        onClick={() => mover(-1)}
        aria-label="Ver anteriores"
        tabIndex={puedeAtras ? 0 : -1}
      >
        ‹
      </button>

      <div
        className="deslizador-pista"
        ref={pista}
        role="region"
        aria-label={etiqueta}
        tabIndex={0}
      >
        {children}
      </div>

      <button
        type="button"
        className={`deslizador-flecha deslizador-flecha--adelante ${
          puedeAdelante ? "" : "deslizador-flecha--oculta"
        }`}
        onClick={() => mover(1)}
        aria-label="Ver siguientes"
        tabIndex={puedeAdelante ? 0 : -1}
      >
        ›
      </button>
    </div>
  );
}

export default Deslizador;