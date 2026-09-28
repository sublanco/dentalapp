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

  async function obtenerHistoria() {
    try {
      setCargando(true);
      setError("");

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
  }

  function mostrarSiNo(valor) {
    return valor === 1 || valor === true ? "Sí" : "No";
  }

  if (cargando) {
    return (
      <div className="historia-contenedor">
        <p>Cargando historia clínica...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historia-contenedor">
        <p>{error}</p>
      </div>
    );
  }

  if (!historia) {
    return (
      <div className="historia-contenedor">
        <p>No se encontró la historia clínica.</p>
      </div>
    );
  }

  return (
    <div className="historia-contenedor">
      <button
      onClick={() => window.history.back()}
    >
      ← Volver a pacientes
    </button>

      {/* ENCABEZADO */}

      <div className="historia-header">
        <h1>Historia Clínica 🦷</h1>

        <p>
          Ficha médica del paciente
        </p>
      </div>

      {/* DATOS DEL PACIENTE */}

      <section className="historia-card">
        <h2>👤 Datos del paciente</h2>

        <div className="datos-grid">

          <div>
            <strong>Nombre y apellido</strong>
            <p>
              {historia.paciente?.nombre}{" "}
              {historia.paciente?.apellido}
            </p>
          </div>

          <div>
            <strong>DNI</strong>
            <p>
              {historia.paciente?.dni || "No informado"}
            </p>
          </div>

          <div>
            <strong>Teléfono</strong>
            <p>
              {historia.paciente?.telefono || "No informado"}
            </p>
          </div>

          <div>
            <strong>Email</strong>
            <p>
              {historia.paciente?.email || "No informado"}
            </p>
          </div>

          <div>
            <strong>Fecha de nacimiento</strong>
            <p>
              {historia.paciente?.fecha_nacimiento ||
                "No informada"}
            </p>
          </div>

          <div>
            <strong>Obra social</strong>
            <p>
              {historia.paciente?.obra_social ||
                "No informada"}
            </p>
          </div>

        </div>
      </section>

      {/* MÉDICO */}

      <section className="historia-card">
        <h2>👨‍⚕️ Médico de cabecera</h2>

        <div className="datos-grid">

          <div>
            <strong>Médico</strong>
            <p>
              {historia.medico_cabecera ||
                "No informado"}
            </p>
          </div>

          <div>
            <strong>Teléfono</strong>
            <p>
              {historia.telefono_medico ||
                "No informado"}
            </p>
          </div>

        </div>
      </section>

      {/* ANTECEDENTES */}

      <section className="historia-card">
        <h2>🚑 Antecedentes médicos</h2>

        <div className="dato-medico">
          <strong>¿Ha utilizado servicios de urgencia?</strong>
          <span>
            {mostrarSiNo(historia.servicio_urgencia)}
          </span>
        </div>

        {historia.servicio_urgencia === 1 && (
          <div className="dato-adicional">
            <strong>¿Cuál?</strong>
            <p>
              {historia.servicio_urgencia_cual ||
                "No informado"}
            </p>
          </div>
        )}

        <div className="dato-medico">
          <strong>¿Ha sido hospitalizado?</strong>
          <span>
            {mostrarSiNo(historia.hospitalizacion)}
          </span>
        </div>

        {historia.hospitalizacion === 1 && (
          <div className="dato-adicional">
            <strong>Motivo de hospitalización</strong>
            <p>
              {historia.hospitalizacion_motivo ||
                "No informado"}
            </p>
          </div>
        )}

        <div className="dato-medico">
          <strong>¿Está bajo tratamiento médico?</strong>
          <span>
            {mostrarSiNo(historia.tratamiento_medico)}
          </span>
        </div>

        {historia.tratamiento_medico === 1 && (
          <div className="dato-adicional">
            <strong>Tratamiento</strong>
            <p>
              {historia.tratamiento_medico_cual ||
                "No informado"}
            </p>
          </div>
        )}
      </section>

      {/* ALERGIAS Y MEDICAMENTOS */}

      <section className="historia-card">
        <h2>💊 Alergias y medicamentos</h2>

        <div className="dato-medico">
          <strong>
            ¿Tiene alergias a medicamentos?
          </strong>

          <span>
            {mostrarSiNo(historia.alergias_medicamentos)}
          </span>
        </div>

        {historia.alergias_medicamentos === 1 && (
          <div className="dato-adicional">
            <strong>¿Cuáles?</strong>

            <p>
              {historia.alergias_cuales ||
                "No informado"}
            </p>
          </div>
        )}

        <div className="dato-medico">
          <strong>
            ¿Presenta sangrado excesivo?
          </strong>

          <span>
            {mostrarSiNo(historia.sangrado_excesivo)}
          </span>
        </div>

        <div className="dato-medico">
          <strong>
            ¿Toma medicamentos actualmente?
          </strong>

          <span>
            {mostrarSiNo(historia.toma_medicamentos)}
          </span>
        </div>

        {historia.toma_medicamentos === 1 && (
          <div className="dato-adicional">
            <strong>Medicamentos</strong>

            <p>
              {historia.medicamentos_cuales ||
                "No informado"}
            </p>
          </div>
        )}
      </section>

      {/* AFECCIONES */}

      <section className="historia-card">
        <h2>🩺 Afecciones médicas</h2>

        <p>
          {historia.afecciones ||
            "No se informaron afecciones."}
        </p>
      </section>

      {/* HÁBITOS */}

      <section className="historia-card">
        <h2>🚬 Hábitos</h2>

        <div className="dato-medico">
          <strong>¿Fuma?</strong>

          <span>
            {mostrarSiNo(historia.fuma)}
          </span>
        </div>

        {historia.fuma === 1 && (
          <div className="dato-adicional">
            <strong>Cantidad de tabaco</strong>

            <p>
              {historia.cantidad_tabaco ||
                "No informado"}
            </p>
          </div>
        )}

        <div className="dato-medico">
          <strong>¿Consume alcohol?</strong>

          <span>
            {mostrarSiNo(historia.bebe_alcohol)}
          </span>
        </div>

        {historia.bebe_alcohol === 1 && (
          <div className="dato-adicional">
            <strong>Cantidad de alcohol</strong>

            <p>
              {historia.cantidad_alcohol ||
                "No informado"}
            </p>
          </div>
        )}
      </section>

      {/* EMBARAZO */}

      <section className="historia-card">
        <h2>🤰 Embarazo</h2>

        <div className="dato-medico">
          <strong>¿Está embarazada?</strong>

          <span>
            {mostrarSiNo(historia.embarazo)}
          </span>
        </div>

        {historia.embarazo === 1 && (
          <div className="dato-adicional">
            <strong>Tiempo de embarazo</strong>

            <p>
              {historia.embarazo_tiempo ||
                "No informado"}
            </p>
          </div>
        )}
      </section>

      {/* RADIACIÓN */}

      <section className="historia-card">
        <h2>☢️ Radiación</h2>

        <div className="dato-medico">
          <strong>¿Ha recibido radiación?</strong>

          <span>
            {mostrarSiNo(historia.radiacion)}
          </span>
        </div>
      </section>

      {/* OTROS DATOS */}

      <section className="historia-card">
        <h2>📝 Otros datos</h2>

        <div className="dato-adicional">
          <strong>Otros datos</strong>

          <p>
            {historia.otros_datos ||
              "Sin información adicional"}
          </p>
        </div>

        <div className="dato-medico">
          <strong>¿Presenta informe médico?</strong>

          <span>
            {mostrarSiNo(historia.informe_medico)}
          </span>
        </div>

        <div className="dato-adicional">
          <strong>Observaciones</strong>

          <p>
            {historia.observaciones ||
              "Sin observaciones"}
          </p>
        </div>
      </section>

      {/* INFORMACIÓN DEL REGISTRO */}

      <section className="historia-registro">

        <p>
          <strong>Historia creada:</strong>{" "}
          {historia.created_at || "No disponible"}
        </p>

        <p>
          <strong>Última actualización:</strong>{" "}
          {historia.updated_at || "No disponible"}
        </p>

      </section>

    </div>
  );
}

export default HistoriaClinica;