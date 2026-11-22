import { useState } from "react";
import Dialogo from "./Dialogo";
import { ETIQUETAS, RECURSOS } from "./configuracion";

function valorInicial(campo, fila, iniciales) {
  if (!fila) return iniciales?.[campo.clave] ?? campo.inicial ?? (campo.tipo === "casilla" ? false : "");

  const v = fila[campo.clave];

  if (campo.tipo === "clave") return "";
  if (campo.tipo === "casilla") return Boolean(v);
  if (v === null || v === undefined) return "";
  if (campo.tipo === "hora") return String(v).slice(0, 5);
  if (campo.tipo === "fecha") return String(v).slice(0, 10);
  return String(v);
}

function FormularioAdmin({ recurso, fila, datos, iniciales, alGuardar, alCerrar }) {
  const editando = Boolean(fila);

  const [valores, setValores] = useState(() =>
    Object.fromEntries(recurso.campos.map((c) => [c.clave, valorInicial(c, fila, iniciales)]))
  );
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const idBase = `campo-${recurso.clave}`;

  function cambiar(clave, valor) {
    setValores((v) => ({ ...v, [clave]: valor }));
  }

  function faltantes() {
    return recurso.campos.filter((c) => {
      const obligatorio = c.requerido || (c.requeridoAlCrear && !editando);
      if (!obligatorio) return false;
      const v = valores[c.clave];
      return typeof v === "string" ? v.trim() === "" : false;
    });
  }

  function armarCuerpo() {
    const cuerpo = {};

    recurso.campos.forEach((c) => {
      const v = valores[c.clave];

      if (c.tipo === "casilla") cuerpo[c.clave] = Boolean(v);
      else if (c.tipo === "numero") cuerpo[c.clave] = v === "" ? null : Number(v);
      else if (c.tipo === "relacion") cuerpo[c.clave] = Number(v);
      else if (c.tipo === "clave") {
        if (v !== "") cuerpo.contrasena = v;
      } else {
        const texto = String(v).trim();
        cuerpo[c.clave] = texto === "" ? null : texto;
      }
    });

    (recurso.conservar || []).forEach((clave) => {
      cuerpo[clave] = fila[clave];
    });

    return recurso.alGuardar ? recurso.alGuardar(cuerpo, fila) : cuerpo;
  }

  async function enviar(e) {
    e.preventDefault();
    if (guardando) return;

    const sinCompletar = faltantes();
    if (sinCompletar.length > 0) {
      setError(
        `Completá los campos obligatorios: ${sinCompletar
          .map((c) => c.etiqueta)
          .join(", ")}.`
      );
      document.getElementById(`${idBase}-${sinCompletar[0].clave}`)?.focus();
      return;
    }

    const menorAlMinimo = recurso.campos.find(
      (c) =>
        c.minimo !== undefined &&
        valores[c.clave] !== "" &&
        Number(valores[c.clave]) < c.minimo
    );
    if (menorAlMinimo) {
      setError(`${menorAlMinimo.etiqueta} tiene que ser ${menorAlMinimo.minimo} o más.`);
      document.getElementById(`${idBase}-${menorAlMinimo.clave}`)?.focus();
      return;
    }

    setError("");
    setGuardando(true);

    try {
      await alGuardar(armarCuerpo());
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  }

  function renderCampo(c) {
    const id = `${idBase}-${c.clave}`;
    const valor = valores[c.clave];
    const obligatorio = c.requerido || (c.requeridoAlCrear && !editando);
    const comunes = {
      id,
      required: obligatorio,
      "aria-required": obligatorio || undefined,
      "aria-describedby": c.ayuda ? `${id}-ayuda` : undefined,
    };

    if (c.tipo === "casilla") {
      return (
        <label className="admin-casilla" key={c.clave}>
          <input
            type="checkbox"
            id={id}
            checked={valor}
            onChange={(e) => cambiar(c.clave, e.target.checked)}
          />
          {c.etiqueta}
        </label>
      );
    }

    let control;

    if (c.tipo === "area") {
      control = (
        <textarea
          {...comunes}
          rows={3}
          value={valor}
          onChange={(e) => cambiar(c.clave, e.target.value)}
        />
      );
    } else if (c.tipo === "opciones") {
      control = (
        <select {...comunes} value={valor} onChange={(e) => cambiar(c.clave, e.target.value)}>
          {c.opciones.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    } else if (c.tipo === "relacion") {
      const resto = datos[c.relacion]?.filas || [];
      const claveId = RECURSOS.find((x) => x.clave === c.relacion).id;
      control = (
        <select {...comunes} value={valor} onChange={(e) => cambiar(c.clave, e.target.value)}>
          <option value="">Elegí una opción</option>
          {resto.map((r) => (
            <option key={r[claveId]} value={r[claveId]}>
              {ETIQUETAS[c.relacion](r)}
            </option>
          ))}
        </select>
      );
    } else {
      const tipoInput = {
        texto: "text",
        email: "email",
        clave: "password",
        numero: "number",
        fecha: "date",
        hora: "time",
      }[c.tipo];

      control = (
        <input
          {...comunes}
          type={tipoInput}
          value={valor}
          min={c.minimo}
          autoComplete={c.tipo === "clave" ? "new-password" : "off"}
          onChange={(e) => cambiar(c.clave, e.target.value)}
        />
      );
    }

    return (
      <div className="admin-campo" key={c.clave}>
        <label htmlFor={id}>
          {c.etiqueta}
          {obligatorio && <span aria-hidden="true"> *</span>}
        </label>
        {control}
        {c.ayuda && (
          <small id={`${id}-ayuda`} className="admin-ayuda">
            {c.ayuda}
          </small>
        )}
      </div>
    );
  }

  return (
    <Dialogo
      id={`${idBase}-titulo`}
      titulo={editando ? `Editar ${recurso.singular}` : `Agregar ${recurso.singular}`}
      alCerrar={alCerrar}
    >
      <form onSubmit={enviar} noValidate>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}

        {recurso.campos.map(renderCampo)}

        <div className="admin-botones">
          <button type="button" className="admin-boton admin-boton--secundario" onClick={alCerrar}>
            Cancelar
          </button>
          <button type="submit" className="admin-boton" disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </Dialogo>
  );
}

export default FormularioAdmin;
