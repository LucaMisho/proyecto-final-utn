
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import Bienvenida from "./components/Bienvenida";
import Noticias from "./components/Noticias";
import Novedades from "./components/Novedades";
import Carrusel from "./components/Carrusel";
import QuienesSomos from "./components/QuienesSomos";
import Sugerencias from "./components/Sugerencias";
import Contacto from "./components/Contacto";
import Login from "./components/Login";

import "./App.css";

function Inicio() {
  return (
    <>
      <Header />

      <main className="contenido-principal">
        <Carrusel />
        <SearchBar />
        <Bienvenida />
        <QuienesSomos />
        <Novedades />
        <Noticias />
        <Sugerencias />
        <Contacto />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
