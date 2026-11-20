import { useEffect, useRef, useState } from "react";

function Reveal({ as: Etiqueta = "div", delay = 0, className = "", children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    // Navegadores sin IntersectionObserver: se muestra directamente
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect(); // anima una sola vez
        }
      },
      { threshold: 0.15 }
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  const clases = [
    "reveal",
    delay > 0 ? `reveal-d${Math.min(delay, 6)}` : "",
    visible ? "reveal--visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Etiqueta ref={ref} className={clases}>
      {children}
    </Etiqueta>
  );
}

export default Reveal;