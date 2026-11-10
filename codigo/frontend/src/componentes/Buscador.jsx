import "./Buscador.css"; /* Importación del archivo de estilos */   
function Buscador() {
    return (
        <section className="buscador"> {/* contiene el buscador */}
            <form className="formulario-buscador">
                <input
                type= "search"
                placeholder="Buscar..."
                aria-label="Buscar"
                />


                <button type="submit">
                    Buscar
                </button>
                </form>
        </section>
    );           
}
export default Buscador;