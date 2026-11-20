<<<<<<< HEAD
<<<<<<< HEAD
import Encabezado from "./componentes/Encabezado"; {/* Importación del componente Encabezado */}
import Buscador from "./componentes/Buscador";

function App() {
  return (
    <>
      <Encabezado /> {/* Renderizado del componente Encabezado */}
      <Buscador /> {/* Renderizado del componente Buscador */}
=======

=======
>>>>>>> 924a475a3fffe5b62ec6dd2a0e5964127409c657
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Inicio from "./pages/Inicio";
import Talleres from "./pages/Talleres";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Terminos from "./pages/Terminos";

<<<<<<< HEAD
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
>>>>>>> 21427447b06b24d4a683183e993894a67041ba41
    </>
  );
}
=======
import "./styles/App.css";
>>>>>>> 924a475a3fffe5b62ec6dd2a0e5964127409c657

<<<<<<< HEAD
export default App;
=======
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/" element={<Inicio />} />
          <Route path="/talleres" element={<Talleres />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

>>>>>>> 21427447b06b24d4a683183e993894a67041ba41
