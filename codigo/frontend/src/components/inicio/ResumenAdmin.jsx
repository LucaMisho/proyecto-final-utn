import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSesion } from "../../contexto/Sesion";
import { pedir } from "../admin/pedir";
import "../../styles/ResumenAdmin.css";

const plural = (n, singular, pluralTexto) => (n === 1 ? singular : pluralTexto);

function Contador({ valor, activo }) {
  const [mostrado, setMostrado] = useState(0);

  useEffect(() => {
    if (!activo) return undefined;

    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sinMovimiento || valor === 0) {
      setMostrado(valor);
      return undefined;
    }

    const duracion = 900;
    const inicio = performance.now();
    let cuadro;

    const paso = (ahora) => {
      const avance = Math.min((ahora - inicio) / duracion, 1);
      setMostrado(Math.round(valor * avance));
      if (avance < 1) cuadro = requestAnimationFrame(paso);
    };

    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [valor, activo]);

  return <>{mostrado}</>;
}

function Dato({ valor, titulo, detalle }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return undefined;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return undefined;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className={`resumen-dato${visible ? " resumen-dato--visible" : ""}`}
    >
      <strong className="resumen-dato-numero">
        <Contador valor={valor} activo={visible} />
      </strong>
      <h3>{titulo}</h3>
      <p>{detalle}</p>
    </article>
  );
}

export default function ResumenAdmin() {
  const { usuario, token } = useSesion();
  const [datos, setDatos] = useState(null);

  const esAdmin = usuario?.rol === "ADMINISTRADOR";

  useEffect(() => {
    if (!esAdmin) return undefined;
    let cancelado = false;

    Promise.allSettled([
      pedir("inscripciones", { token }),
      pedir("sugerencias", { token }),
      pedir("talleres", { token }),
    ]).then(([inscripciones, sugerencias, talleres]) => {
      if (cancelado) return;
      const lista = (r) =>
        r.status === "fulfilled" && Array.isArray(r.value) ? r.value : null;

      setDatos({
        inscripciones: lista(inscripciones),
        sugerencias: lista(sugerencias),
        talleres: lista(talleres),
      });
    });

    return () => {
      cancelado = true;
    };
  }, [esAdmin, token]);

  if (!esAdmin || !datos) return null;

  const tarjetas = [];

  if (datos.inscripciones) {
    const aceptadas = datos.inscripciones.filter((i) => i.estado === "aceptada");
    const pendientes = datos.inscripciones.filter((i) => i.estado === "pendiente").length;
    tarjetas.push({
      clave: "alumnos",
      valor: new Set(aceptadas.map((i) => i.id_alumno)).size,
      titulo: "Alumnos inscriptos",
      detalle: `${pendientes} ${plural(pendientes, "inscripción pendiente", "inscripciones pendientes")}`,
    });
  }

  if (datos.sugerencias) {
    const pendientes = datos.sugerencias.filter((s) => s.estado === "pendiente").length;
    tarjetas.push({
      clave: "sugerencias",
      valor: datos.sugerencias.length,
      titulo: "Sugerencias recibidas",
      detalle: `${pendientes} ${plural(pendientes, "pendiente", "pendientes")} de revisar`,
    });
  }

  if (datos.talleres) {
    const activos = datos.talleres.filter((t) => t.estado === "activo").length;
    tarjetas.push({
      clave: "talleres",
      valor: datos.talleres.length,
      titulo: "Talleres creados",
      detalle: `${activos} ${plural(activos, "activo", "activos")}`,
    });
  }

  if (tarjetas.length === 0) return null;

  return (
    <section
      className="resumen-admin banda banda--rosa"
      aria-labelledby="resumen-admin-titulo"
    >
      <div className="resumen-admin-encabezado">
        <div>
          <span className="resumen-admin-etiqueta">Vista de administrador</span>
          <h2 id="resumen-admin-titulo">Resumen del programa</h2>
        </div>
        <Link to="/admin" className="resumen-admin-enlace">
          Ir al panel →
        </Link>
      </div>

      <div className="resumen-admin-grilla">
        {tarjetas.map((t) => (
          <Dato key={t.clave} valor={t.valor} titulo={t.titulo} detalle={t.detalle} />
        ))}
      </div>
    </section>
  );
}