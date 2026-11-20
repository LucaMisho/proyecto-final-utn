/**
 * Tarjetas "fantasma" con brillo animado, para mostrar mientras
 * se cargan los datos de la API.
 *
 * Uso: {cargando ? <Skeleton cantidad={3} /> : <ListaReal />}
 */
function Skeleton({ cantidad = 3 }) {
  return (
    <>
      {Array.from({ length: cantidad }, (_, i) => (
        <div
          key={i}
          className="skeleton-card"
          aria-hidden="true"
        >
          <div className="skeleton skeleton-imagen"></div>
          <div className="skeleton skeleton-linea skeleton-linea--titulo"></div>
          <div className="skeleton skeleton-linea"></div>
          <div className="skeleton skeleton-linea skeleton-linea--corta"></div>
        </div>
      ))}
    </>
  );
}

export default Skeleton;