import "./Inicio.css";

function Inicio() {
  return (
    <section className="inicio" id="inicio">
      <div className="inicio-contenido">
        <h1>Bienvenidos a Barrio Cultura y Envión Quequén</h1>

        <p>
          Un espacio de encuentro, aprendizaje y participación
          para toda la comunidad de Quequén y Necochea.
        </p>

        <a href="#talleres" className="inicio-boton">
          Conocé nuestros talleres
        </a>
      </div>

      <div className="inicio-imagen">
        {/* colocar la imagen principal */}
      </div>
    </section>
  );
}

export default Inicio;
