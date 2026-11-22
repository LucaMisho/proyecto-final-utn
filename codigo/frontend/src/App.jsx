import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AvisosProvider } from "./contexto/Avisos";
import { SesionProvider } from "./contexto/Sesion";

import MainLayout from "./layouts/MainLayout";

import Inicio from "./pages/Inicio";
import Talleres from "./pages/Talleres";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
<<<<<<< HEAD
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import TodasNovedades from "./pages/TodasNovedades";
import TodasNoticias from "./pages/TodasNoticias";
import NoticiaDetalle from "./pages/NoticiaDetalle";
=======
import Terminos from "./pages/Terminos";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";

import { AvisosProvider } from "./contexto/Avisos";
import { SesionProvider } from "./contexto/Sesion";
>>>>>>> 1239fbefcbdb8750fa98aaac735f7c93c0d3b87c

import "./styles/App.css";

function App() {
  return (
<<<<<<< HEAD
     <AvisosProvider>
      <SesionProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/noticias" element={<TodasNoticias />} />
          <Route path="/noticias/:id" element={<NoticiaDetalle />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/" element={<Inicio />} />
          <Route path="/talleres" element={<Talleres />} />
          <Route path="/novedades" element={<TodasNovedades />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
    </SesionProvider>
=======
    <AvisosProvider>
      <SesionProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/terminos" element={<Terminos />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/" element={<Inicio />} />
              <Route path="/talleres" element={<Talleres />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </BrowserRouter>
      </SesionProvider>
>>>>>>> 1239fbefcbdb8750fa98aaac735f7c93c0d3b87c
    </AvisosProvider>
  );
}

export default App;

