import { useState } from "react";
import FormularioAdmin from "./FormularioAdmin";
import Confirmar from "./Confirmar";
import Dialogo from "./Dialogo";
import { ROLES } from "./configuracion";
import ImportarAlumnos from "./ImportarAlumnos";
import writeXlsxFile from "write-excel-file";
import { pedir, ErrorDeSesion } from "./pedir";
import { normalizar } from "../talleres/Utilidades.js";

function TablaAdmin({
  recurso,
  estado,
  datos,
  etiquetaDe,
  sesion,
  token,
  avisar,
  alCambiar,
  alFallarSesion,
  alReintentar,
}) {
  const [importando, setImportando] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [formulario, setFormulario] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [cambioRol, setCambioRol] = useState(null);

  const filas = estado.filas;
  const puedeEliminar = ["ADMINISTRADOR", "PERSONAL"].includes(sesion.rol);

 async function importar(lista) {
  const resultado = await ejecutar(() =>
    pedir(`${recurso.ruta}/lote`, {
      metodo: "POST",
      cuerpo: { alumnos: lista },
      token,
    })
  );

  avisar(`Se importaron ${resultado?.importados ?? lista.length} alumnos.`, "exito");
  setImportando(false);
  alCambiar(recurso.clave);
}

  function textoDeCelda(fila, columna) {
    const valor = fila[columna.clave];
    if (columna.tipo === "imagen") return "";
    if (columna.relacion) {
      return valor === null || valor === undefined || valor === "" ? "" : etiquetaDe(columna.relacion, valor);
    }
    if (columna.mostrar) return columna.mostrar(valor);
    return valor === null || valor === undefined ? "" : String(valor);
  }

  const visibles = filas.filter((fila) => {
    if (!filtro.trim()) return true;
    const texto = recurso.columnas.map((c) => textoDeCelda(fila, c)).join(" ");
    return normalizar(texto).includes(normalizar(filtro.trim()));
  });

  function fechaDeHoy() {
  const hoy = new Date();
  const m = String(hoy.getMonth() + 1).padStart(2, "0");
  const d = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${m}-${d}`;
}

async function exportar() {
  const columnas = recurso.columnas.filter((c) => c.tipo !== "imagen" && c.tipo !== "rol");

  const encabezado = columnas.map((c) => ({
    value: c.titulo,
    fontWeight: "bold",
    backgroundColor: "#5B2C83",
    color: "#FFFFFF",
  }));

  const cuerpo = visibles.map((fila) =>
    columnas.map((c) => {
      const texto = textoDeCelda(fila, c);
      return { type: String, value: texto === "" ? undefined : texto };
    })
  );

  await writeXlsxFile([encabezado, ...cuerpo], {
    fileName: `${recurso.clave}-${fechaDeHoy()}.xlsx`,
    columns: columnas.map(() => ({ width: 22 })),
  });
}

  
  async function ejecutar(accion) {
    try {
      return await accion();
    } catch (error) {
      if (error instanceof ErrorDeSesion) alFallarSesion(error);
      throw error;
    }
  }

  async function guardar(cuerpo) {
    const fila = formulario.fila;
    const ruta = fila ? `${recurso.ruta}/${fila[recurso.id]}` : recurso.ruta;
    const metodo = fila ? recurso.metodoEditar || "PUT" : "POST";

    await ejecutar(() => pedir(ruta, { metodo, cuerpo, token }));

    avisar(fila ? "Cambios guardados." : `Se agregó el ${recurso.singular}.`, "exito");
    setFormulario(null);
    alCambiar(recurso.clave);
  }

  async function eliminar() {
    const fila = aEliminar;

    try {
      await ejecutar(() =>
        pedir(`${recurso.ruta}/${fila[recurso.id]}`, { metodo: "DELETE", token })
      );
      avisar(`Se eliminó: ${recurso.nombreDe(fila)}.`, "exito");
      alCambiar(recurso.clave);
    } catch (error) {
      if (!(error instanceof ErrorDeSesion)) avisar(error.message, "error");
    }

    setAEliminar(null);
  }

  async function confirmarRol() {
    const { fila, rol } = cambioRol;

    try {
      await ejecutar(() =>
        pedir(`${recurso.ruta}/${fila[recurso.id]}`, {
          metodo: "PATCH",
          cuerpo: {
            username: fila.username,
            email: fila.email,
            estado: fila.estado,
            rol,
          },
          token,
        })
      );
      avisar(`Ahora ${fila.username} tiene el rol ${rol}.`, "exito");
      alCambiar(recurso.clave);
    } catch (error) {
      if (!(error instanceof ErrorDeSesion)) avisar(error.message, "error");
    }

    setCambioRol(null);
  }

  function celda(fila, columna) {
    if (columna.tipo === "rol") {
      const propio = fila[recurso.id] === sesion.id_usuario;

      return (
        <select
          aria-label={`Rol de ${fila.username}`}
          value={fila.rol}
          disabled={propio}
          title={propio ? "No podés cambiar tu propio rol" : undefined}
          onChange={(e) => setCambioRol({ fila, rol: e.target.value })}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      );
    }

    if (columna.tipo === "imagen") {
  const url = fila[columna.clave];

  return url ? (
    <img
      src={url}
      alt={`Imagen de ${recurso.nombreDe(fila)}`}
      className="admin-miniatura"
    />
  ) : (
    <span className="admin-sin-imagen">Sin imagen</span>
  );
}

    return textoDeCelda(fila, columna);
  }

  function contenido() {
    if (estado.cargando) {
      return (
        <p className="admin-mensaje" role="status">
          Cargando {recurso.titulo.toLowerCase()}...
        </p>
      );
    }

    if (estado.error) {
      return (
        <div className="admin-mensaje" role="alert">
          <p>{estado.error}</p>
          <button type="button" className="admin-boton" onClick={() => alReintentar(recurso.clave)}>
            Reintentar
          </button>
        </div>
      );
    }

    if (filas.length === 0) {
      return <p className="admin-mensaje">Todavía no hay {recurso.titulo.toLowerCase()}.</p>;
    }

    if (visibles.length === 0) {
      return <p className="admin-mensaje">No hay resultados para tu búsqueda.</p>;
    }

    return (
      <div
        className="admin-tabla-contenedor"
        role="region"
        aria-label={`Tabla de ${recurso.titulo.toLowerCase()}`}
        tabIndex={0}
      >
        <table className="admin-tabla">
          <caption className="admin-solo-lectores">
            {recurso.titulo}: {visibles.length} {visibles.length === 1 ? "registro" : "registros"}
          </caption>
          <thead>
            <tr>
              {recurso.columnas.map((c) => (
                <th key={c.clave} scope="col">
                  {c.titulo}
                </th>
              ))}
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((fila) => {
              const propia = recurso.clave === "usuarios" && fila[recurso.id] === sesion.id_usuario;

              return (
                <tr key={fila[recurso.id]}>
                  {recurso.columnas.map((c) => (
                    <td key={c.clave}>{celda(fila, c)}</td>
                  ))}
                  <td>
                    <div className="admin-acciones">
                      <button
                        type="button"
                        className="admin-boton admin-boton--chico"
                        aria-label={`Editar ${recurso.nombreDe(fila)}`}
                        onClick={() => setFormulario({ fila })}
                      >
                        Editar
                      </button>
                      {puedeEliminar && (
                        <button
                          type="button"
                          className="admin-boton admin-boton--chico admin-boton--peligro"
                          aria-label={
                            propia
                              ? "No podés eliminar tu propia cuenta"
                              : `Eliminar ${recurso.nombreDe(fila)}`
                          }
                          disabled={propia}
                          onClick={() => setAEliminar(fila)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-barra">
        <label className="admin-filtro">
          <span>Buscar en {recurso.titulo.toLowerCase()}</span>
          <input
            type="search"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </label>

        {!recurso.sinAgregar && (
          <button type="button" className="admin-boton" onClick={() => setFormulario({ fila: null })}>
            Agregar {recurso.singular}
          </button>
        )}
      {recurso.importable && (
      <button
        type="button"
        className="admin-boton admin-boton--secundario"
        onClick={() => setImportando(true)}
      >
        Importar Excel
      </button>
    )}

    {recurso.exportable && (
  <button
    type="button"
    className="admin-boton admin-boton--secundario"
    onClick={exportar}
    disabled={visibles.length === 0}
  >
    Exportar Excel
  </button>
)}
      </div>

      {contenido()}

      {formulario && (
        <FormularioAdmin
          recurso={recurso}
          fila={formulario.fila}
          datos={datos}
          iniciales={recurso.iniciales?.(datos, sesion)}
          alGuardar={guardar}
          alCerrar={() => setFormulario(null)}
        />
      )}

      {importando && (
         <Dialogo
          id={`${recurso.clave}-importar`}
          titulo={`Importar ${recurso.titulo.toLowerCase()} desde Excel`}
          alCerrar={() => setImportando(false)}
         >
          <ImportarAlumnos alConfirmar={importar} />
        </Dialogo>
)}

      {aEliminar && (
        <Confirmar
          id="confirmar-eliminar"
          titulo="Eliminar"
          mensaje={`¿Seguro que querés eliminar: ${recurso.nombreDe(aEliminar)}? Esta acción no se puede deshacer.`}
          textoBoton="Eliminar"
          alConfirmar={eliminar}
          alCerrar={() => setAEliminar(null)}
        />
      )}

      {cambioRol && (
        <Confirmar
          id="confirmar-rol"
          titulo="Cambiar rol"
          mensaje={`¿Cambiar el rol de ${cambioRol.fila.username} de ${cambioRol.fila.rol} a ${cambioRol.rol}?`}
          textoBoton="Cambiar rol"
          alConfirmar={confirmarRol}
          alCerrar={() => setCambioRol(null)}
        />
      )}
    </div>
  );
}

export default TablaAdmin;
