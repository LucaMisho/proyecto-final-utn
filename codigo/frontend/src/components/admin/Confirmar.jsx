import { useState } from "react";
import Dialogo from "./Dialogo";

function Confirmar({ id, titulo, mensaje, textoBoton, alConfirmar, alCerrar }) {
  const [trabajando, setTrabajando] = useState(false);

  async function confirmar() {
    setTrabajando(true);
    await alConfirmar();
  }

  return (
    <Dialogo id={id} titulo={titulo} alCerrar={alCerrar}>
      <p>{mensaje}</p>

      <div className="admin-botones">
        <button
          type="button"
          className="admin-boton admin-boton--secundario"
          onClick={alCerrar}
          autoFocus
        >
          Cancelar
        </button>
        <button
          type="button"
          className="admin-boton admin-boton--peligro"
          onClick={confirmar}
          disabled={trabajando}
        >
          {trabajando ? "Procesando..." : textoBoton}
        </button>
      </div>
    </Dialogo>
  );
}

export default Confirmar;
