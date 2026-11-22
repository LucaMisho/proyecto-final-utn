import useTitulo from "../hooks/useTitulo";
import Carrusel from "../components/inicio/Carrusel";
import QuienesSomos from "../components/inicio/QuienesSomos";
import Novedades from "../components/inicio/Novedades";
import Noticias from "../components/inicio/Noticias";
import Sugerencias from "../components/inicio/Sugerencias";
import Contacto from "../components/inicio/Contacto";

import TransicionSeccion from "../components/inicio/TransicionSeccion";
import "../styles/TransicionSeccion.css";

function SeparadorBurbujas() {
  return (
    <div className="separador separador-burbujas" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

export default function Inicio() {
  useTitulo("");

  return (
    <>
      <Carrusel />

      <TransicionSeccion>
        <QuienesSomos />

        <SeparadorBurbujas />

        <Novedades />

        <SeparadorBurbujas />

        <Noticias />

        <SeparadorBurbujas />

        <Sugerencias />

        <SeparadorBurbujas />

        <Contacto />
      </TransicionSeccion>
    </>
  );
}
