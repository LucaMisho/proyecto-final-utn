import Encabezado from "./componentes/Encabezado"; {/* Importación del componente Encabezado */}
import Buscador from "./componentes/Buscador";

function App() {
  return (
    <>
      <Encabezado /> {/* Renderizado del componente Encabezado */}
      <Buscador /> {/* Renderizado del componente Buscador */}
    </>
  );
}

export default App;