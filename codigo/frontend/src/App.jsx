import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Inicio from "./pages/Inicio";
import Talleres from "./pages/Talleres";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Terminos from "./pages/Terminos";

import "./styles/App.css";

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

