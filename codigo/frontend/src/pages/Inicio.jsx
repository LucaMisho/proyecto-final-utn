import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ResumenAdmin from "../components/inicio/ResumenAdmin";
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

  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;

    const bajar = () => document.getElementById(hash.slice(1))?.scrollIntoView();
    const tiempos = [0, 400, 1200].map((ms) => setTimeout(bajar, ms));

    return () => tiempos.forEach(clearTimeout);
  }, [hash]);

  return (
    <>
      <Carrusel />
<ResumenAdmin />
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
