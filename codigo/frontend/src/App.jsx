import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Inicio from "./pages/Inicio";
import Login from "./pages/Login";

import "./styles/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Inicio />} />
          {/* acá van después: /talleres */}
        </Route>

        <Route path="/login" element={<Login />} />
        {/* y /registro */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

