import Reveal from "../components/inicio/Reveal";
import "../styles/Comunidad.css";

function Comunidad() {
  return (
    <main className="pagina-comunidad">
      <Reveal className="comunidad-encabezado">
        <h1>Nuestra comunidad</h1>
        <p>
          Un espacio de encuentro, aprendizaje y acompañamiento
          para crecer juntos.
        </p>
      </Reveal>

      <section className="comunidad-contenido">
        <article className="comunidad-bloque">
          <h2>¿Quiénes somos?</h2>
          <p>
            Barrio Cultura es un espacio que promueve la participación,
            la inclusión y el desarrollo de niños, niñas y jóvenes
            a través de distintas propuestas comunitarias.
          </p>
        </article>

        <article className="comunidad-bloque">
          <h2>¿Qué hacemos?</h2>
          <p>
            Trabajamos junto a las familias y los barrios, generando
            oportunidades de aprendizaje, recreación, expresión
            y participación.
          </p>
        </article>

        <article className="comunidad-bloque">
          <h2>Nuestro equipo</h2>
          <p>
            Contamos con un equipo de personas que acompaña las
            actividades y propuestas, promoviendo el trabajo
            colectivo y el compromiso con la comunidad.
          </p>
        </article>
      </section>
    </main>
  );
}

export default Comunidad;
