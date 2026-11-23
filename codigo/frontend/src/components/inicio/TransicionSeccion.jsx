
import { useEffect, useRef } from "react";

export default function TransicionSeccion({ children, delay = 0 }) {
  const referencia = useRef(null);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          elemento.classList.add("visible");
          observador.unobserve(elemento);
        }
      },
      {
        threshold: 0.12,
      }
    );

    observador.observe(elemento);

    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={referencia}
      className="transicion-seccion"
      style={{ "--delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
}
