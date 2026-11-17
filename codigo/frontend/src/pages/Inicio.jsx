import Carrusel from "../components/inicio/Carrusel";
import SearchBar from "../components/inicio/SearchBar";
import Bienvenida from "../components/inicio/Bienvenida";
import QuienesSomos from "../components/inicio/QuienesSomos";
import Novedades from "../components/inicio/Novedades";
import Noticias from "../components/inicio/Noticias";
import Sugerencias from "../components/inicio/Sugerencias";
import Contacto from "../components/inicio/Contacto";

export default function Inicio() {
  return (
    <>
      <Carrusel />
      <SearchBar />
      <Bienvenida />
      <QuienesSomos />
      <Novedades />
      <Noticias />
      <Sugerencias />
      <Contacto />
    </>
  );
}