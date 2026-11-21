import { useEffect, useRef, useState } from "react";

// Ventana modal: el foco queda adentro, Esc la cierra y al cerrar el foco vuelve a donde estaba
export default function Dialogo({ id, titulo, alCerrar, children }) {
  const ventana = useRef(null);
  const [anterior] = useState(() => document.activeElement);

  useEffect(() => {
    const dialogo = ventana.current;

    if (!dialogo.open) dialogo.showModal();

    return () => {
      if (anterior && document.contains(anterior)) {
        anterior.focus();
      } else {
        document.querySelector(".admin-panel h2")?.focus();
      }
    };
  }, [anterior]);

  function cancelar(e) {
    e.preventDefault();
    alCerrar();
  }

  return (
    <dialog
      ref={ventana}
      className="admin-dialogo"
      aria-labelledby={id}
      onCancel={cancelar}
    >
      <h2 id={id}>{titulo}</h2>
      {children}
    </dialog>
  );
}
