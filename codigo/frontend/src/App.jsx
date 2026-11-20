import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AvisosProvider } from "./contexto/Avisos";
import { SesionProvider } from "./contexto/Sesion";

import MainLayout from "./layouts/MainLayout";

import Inicio from "./pages/Inicio";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Terminos from "./pages/Terminos";
import Perfil from "./pages/Perfil";

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
              <Route path="/" element={<Inicio />} />
              {/* acá van después: /talleres */}
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
