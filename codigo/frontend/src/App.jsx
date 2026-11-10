import Encabezado from "./componentes/Encabezado/Encabezado"; {/* Importación del componente Encabezado */}
import Buscador from "./componentes/Buscador/Buscador";

function App() {
  return (
    <>
      <Encabezado /> {/* Renderizado del componente Encabezado */}
      <Buscador /> {/* Renderizado del componente Buscador */}
    </>
  );
}

export default App;