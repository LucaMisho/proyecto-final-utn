import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Inicio from "./pages/Inicio";
import Talleres from "./pages/Talleres";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Terminos from "./pages/Terminos";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import Actividades from "./pages/Actividades";
import Comunidad from "./pages/Comunidad";

import { AvisosProvider } from "./contexto/Avisos";
import { SesionProvider } from "./contexto/Sesion";


import "./styles/App.css";

function App() {
  return (
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
              
              <Route path="/actividades" element={<Actividades />} />
              <Route path="/comunidad" element={<Comunidad />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </BrowserRouter>
      </SesionProvider>
    </AvisosProvider>
  );
}

export default App;

