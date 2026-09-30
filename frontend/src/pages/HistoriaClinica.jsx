import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function HistoriaClinica() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [historia, setHistoria] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [noExiste, setNoExiste] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerHistoria();
  }, [id]);

  async function obtenerHistoria() {
    try {
      setCargando(true);
      setError("");
      setNoExiste(false);

      console.log("ID DEL PACIENTE EN HISTORIA CLÍNICA:", id);

      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/historias-clinicas/${id}`
      );

      // El paciente existe pero todavía no tiene historia clínica
      if (respuesta.status === 404) {
        setNoExiste(true);
        return;
      }

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
      <div style={{ padding: "30px" }}>
        <h2>Historia Clínica 🦷</h2>
        <p>Cargando...</p>
      </div>
    );
  }

  // No existe historia clínica para este paciente
  if (noExiste) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h2>Historia Clínica 🦷</h2>

        <div
          style={{
            maxWidth: "600px",
            margin: "40px auto",
            padding: "30px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h3>Este paciente todavía no tiene historia clínica.</h3>

          <p>
            Podés crear la historia clínica para este paciente desde aquí.
          </p>

          <button
            onClick={() =>
              navigate(`/historias-clinicas/${id}/crear`)
            }
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#198754",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ➕ Crear historia clínica
          </button>

          <br />

          <button
            onClick={() => navigate("/pacientes")}
            style={{
              marginTop: "15px",
              padding: "10px 18px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            ← Volver a pacientes
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Historia Clínica 🦷</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!historia) {
    return null;
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "25px",
      }}
    >
      <h1>Historia Clínica 🦷</h1>

      {/* DATOS DEL PACIENTE */}
      <section
        style={{
          marginTop: "25px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <h2>Datos del paciente</h2>

        {historia.paciente && (
          <>
            <p>
              <strong>Nombre:</strong>{" "}
              {historia.paciente.nombre} {historia.paciente.apellido}
            </p>

            <p>
              <strong>DNI:</strong> {historia.paciente.dni}
            </p>

            <p>
              <strong>Teléfono:</strong>{" "}
              {historia.paciente.telefono || "No informado"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {historia.paciente.email || "No informado"}
            </p>
          </>
        )}
      </section>

      {/* MÉDICO */}
      <section
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <h2>Datos médicos</h2>

        <p>
          <strong>Médico de cabecera:</strong>{" "}
          {historia.medico_cabecera || "No informado"}
        </p>

        <p>
          <strong>Teléfono del médico:</strong>{" "}
          {historia.telefono_medico || "No informado"}
        </p>

        <p>
          <strong>Servicio de urgencia:</strong>{" "}
          {mostrarSiNo(historia.servicio_urgencia)}
        </p>

        {historia.servicio_urgencia_cual && (
          <p>
            <strong>Cuál:</strong> {historia.servicio_urgencia_cual}
          </p>
        )}
      </section>

      {/* ANTECEDENTES */}
      <section
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <h2>Antecedentes</h2>

        <p>
          <strong>Hospitalización:</strong>{" "}
          {mostrarSiNo(historia.hospitalizacion)}
        </p>

        {historia.hospitalizacion_motivo && (
          <p>
            <strong>Motivo:</strong>{" "}
            {historia.hospitalizacion_motivo}
          </p>
        )}

        <p>
          <strong>Tratamiento médico:</strong>{" "}
          {mostrarSiNo(historia.tratamiento_medico)}
        </p>

        {historia.tratamiento_medico_cual && (
          <p>
            <strong>Cuál:</strong>{" "}
            {historia.tratamiento_medico_cual}
          </p>
        )}

        <p>
          <strong>Alergias a medicamentos:</strong>{" "}
          {mostrarSiNo(historia.alergias_medicamentos)}
        </p>

        {historia.alergias_cuales && (
          <p>
            <strong>Cuáles:</strong>{" "}
            {historia.alergias_cuales}
          </p>
        )}

        <p>
          <strong>Sangrado excesivo:</strong>{" "}
          {mostrarSiNo(historia.sangrado_excesivo)}
        </p>
      </section>

      {/* AFECCIONES */}
      <section
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <h2>Afecciones</h2>

        <p>
          <strong>Afecciones:</strong>{" "}
          {Array.isArray(historia.afecciones)
            ? historia.afecciones.join(", ")
            : historia.afecciones || "Ninguna"}
        </p>
      </section>

      {/* MEDICAMENTOS */}
      <section
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <h2>Medicamentos</h2>

        <p>
          <strong>Toma medicamentos:</strong>{" "}
          {mostrarSiNo(historia.toma_medicamentos)}
        </p>

        {historia.medicamentos_cuales && (
          <p>
            <strong>Cuáles:</strong>{" "}
            {historia.medicamentos_cuales}
          </p>
        )}
      </section>

      {/* HÁBITOS */}
      <section
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <h2>Hábitos</h2>

        <p>
          <strong>Cansancio al caminar:</strong>{" "}
          {mostrarSiNo(historia.cansancio_al_caminar)}
        </p>

        <p>
          <strong>Fuma:</strong>{" "}
          {mostrarSiNo(historia.fuma)}
        </p>

        {historia.cantidad_tabaco && (
          <p>
            <strong>Cantidad de tabaco:</strong>{" "}
            {historia.cantidad_tabaco}
          </p>
        )}

        <p>
          <strong>Bebe alcohol:</strong>{" "}
          {mostrarSiNo(historia.bebe_alcohol)}
        </p>

        {historia.cantidad_alcohol && (
          <p>
            <strong>Cantidad de alcohol:</strong>{" "}
            {historia.cantidad_alcohol}
          </p>
        )}
      </section>

      {/* EMBARAZO */}
      <section
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <h2>Embarazo</h2>

        <p>
          <strong>Embarazo:</strong>{" "}
          {mostrarSiNo(historia.embarazo)}
        </p>

        {historia.embarazo_tiempo && (
          <p>
            <strong>Tiempo:</strong>{" "}
            {historia.embarazo_tiempo}
          </p>
        )}
      </section>

      {/* RADIACIÓN */}
      <section
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <h2>Radiación</h2>

        <p>
          <strong>Radiación:</strong>{" "}
          {mostrarSiNo(historia.radiacion)}
        </p>
      </section>

      {/* INFORME MÉDICO */}
      <section
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <h2>Informe médico</h2>

        <p>
          <strong>Informe médico:</strong>{" "}
          {mostrarSiNo(historia.informe_medico)}
        </p>

        <p>
          <strong>Observaciones:</strong>{" "}
          {historia.observaciones || "Sin observaciones"}
        </p>
      </section>
      <button
        onClick={() =>
          navigate(`/historias-clinicas/${id}/editar`)
        }
        style={{
          marginTop: "30px",
          marginRight: "10px",
          padding: "12px 20px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#0d6efd",
          color: "white",
          cursor: "pointer",
        }}
      >
        ✏️ Editar historia clínica
      </button>

      <button
        onClick={() => navigate("/pacientes")}
        style={{
          marginTop: "30px",
          padding: "12px 20px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#6c757d",
          color: "white",
          cursor: "pointer",
        }}
      >
        ← Volver a pacientes
      </button>
    </div>
  );
}

export default HistoriaClinica;