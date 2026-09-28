import { useEffect, useState } from "react";
import { useParams } from "react-router";

function HistoriaClinica() {
const { id } = useParams();
  const [historia, setHistoria] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  obtenerHistoria();
}, [id]);

  const obtenerHistoria = async () => {
    try {
      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/historias-clinicas/${id}`
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo obtener la historia clínica");
      }

      const datos = await respuesta.json();

      setHistoria(datos);
    } catch (error) {
      console.error(error);
      setError("No se pudo cargar la historia clínica");
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <p>Cargando historia clínica...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Historia Clínica 🦷</h1>

      {historia && (
        <div>
          <h2>
            Paciente: {historia.paciente?.nombre}{" "}
            {historia.paciente?.apellido}
          </h2>

          <p>
            Médico de cabecera: {historia.medico_cabecera || "No informado"}
          </p>

          <p>
            Observaciones: {historia.observaciones || "Sin observaciones"}
          </p>
        </div>
      )}
    </div>
  );
}

export default HistoriaClinica;