import { useEffect } from "react";
import { Link } from "react-router-dom";
import useTitulo from "../hooks/useTitulo";
import useNovedades from "../hooks/useNovedades";
import NovedadesLista from "../components/inicio/NovedadesLista";
import "../styles/Novedades.css";

export default function TodasNovedades() {
  useTitulo("Novedades");

  const { novedades, cargando, error, recargar } = useNovedades();

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

      <NovedadesLista
        novedades={novedades}
        cargando={cargando}
        error={error}
        onReintentar={recargar}
      />
    </section>
  );
}