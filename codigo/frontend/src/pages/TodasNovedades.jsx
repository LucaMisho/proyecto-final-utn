import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo";
import useNovedades from "../hooks/useNovedades";
import NovedadesLista, { claveDeCategoria } from "../components/inicio/NovedadesLista";
import "../styles/Novedades.css";

const CATEGORIAS = [
  { clave: "todas", nombre: "Todas" },
  { clave: "talleres", nombre: "Talleres" },
  { clave: "actividades", nombre: "Actividades" },
  { clave: "comunidad", nombre: "Comunidad" },
];

export default function TodasNovedades() {
  useTitulo("Novedades");

  const { novedades, cargando, error, recargar } = useNovedades();
  const [categoria, setCategoria] = useState("todas");

  const cantidadDe = (clave) =>
    clave === "todas"
      ? novedades.length
      : novedades.filter((n) => claveDeCategoria(n.categoria) === clave).length;

  const visibles =
    categoria === "todas"
      ? novedades
      : novedades.filter((n) => claveDeCategoria(n.categoria) === categoria);

  const elegida = CATEGORIAS.find((c) => c.clave === categoria);

  // Al navegar desde el Inicio, la página arranca arriba de todo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="novedades novedades-pagina banda banda--celeste banda--parallax">
      <div className="novedades-encabezado">
        <div>
          <h2>Todas las novedades</h2>
          <p className="novedades-subtitulo">
            Lo último de nuestros barrios
          </p>
        </div>

        <Link to="/" className="novedades-ver-todas">
          ← Volver al inicio
        </Link>
      </div>

      {!cargando && !error && novedades.length > 0 && (
        <div
          className="novedades-filtros"
          role="group"
          aria-label="Filtrar novedades por categoría"
        >
          {CATEGORIAS.map((c) => (
            <button
              key={c.clave}
              type="button"
              className="novedades-filtro"
              aria-pressed={categoria === c.clave}
              onClick={() => setCategoria(c.clave)}
            >
              {c.nombre} ({cantidadDe(c.clave)})
            </button>
          ))}
        </div>
      )}

      <p className="novedades-aviso-lector" role="status">
        {!cargando && !error && novedades.length > 0
          ? `Mostrando ${visibles.length} ${visibles.length === 1 ? "novedad" : "novedades"} de ${elegida.nombre === "Todas" ? "todas las categorías" : elegida.nombre}.`
          : ""}
      </p>

      <NovedadesLista
        key={categoria}
        novedades={visibles}
        cargando={cargando}
        error={error}
        onReintentar={recargar}
        mensajeVacio={`No hay novedades de ${elegida.nombre} por ahora.`}
      />
    </section>
  );
}