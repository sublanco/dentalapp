import { useState } from "react";
import { useNavigate, useParams } from "react-router";

function CrearHistoriaClinica() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    medico_cabecera: "",
    telefono_medico: "",

    servicio_urgencia: false,
    servicio_urgencia_cual: "",

    hospitalizacion: false,
    hospitalizacion_motivo: "",

    tratamiento_medico: false,
    tratamiento_medico_cual: "",

    alergias_medicamentos: false,
    alergias_cuales: "",

    sangrado_excesivo: false,

    afecciones: "",

    toma_medicamentos: false,
    medicamentos_cuales: "",

    cansancio_al_caminar: false,

    fuma: false,
    cantidad_tabaco: "",

    bebe_alcohol: false,
    cantidad_alcohol: "",

    embarazo: false,
    embarazo_tiempo: "",

    radiacion: false,

    otros_datos: "",

    informe_medico: false,

    observaciones: "",
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function manejarCambio(e) {
    const { name, value, type, checked } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function guardarHistoria(e) {
    e.preventDefault();

    try {
      setGuardando(true);
      setError("");

      const datos = {
        paciente_id: Number(id),

        ...formulario,

        afecciones: formulario.afecciones
          ? [formulario.afecciones]
          : [],
      };

      const respuesta = await fetch(
        "http://127.0.0.1:8000/api/historias-clinicas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(datos),
        }
      );

      if (!respuesta.ok) {
        const errorServidor = await respuesta.json();

        console.error(
          "Error del servidor:",
          errorServidor
        );

        throw new Error(
          "No se pudo guardar la historia clínica"
        );
      }

      await respuesta.json();

      alert("Historia clínica creada correctamente");

      navigate(`/historias-clinicas/${id}`);

    } catch (error) {
      console.error(error);

      setError(
        "No se pudo guardar la historia clínica."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="historia-contenedor">

      <button
        type="button"
        onClick={() =>
          navigate(`/historias-clinicas/${id}`)
        }
      >
        ← Volver
      </button>

      <div className="historia-header">
        <h1>🦷 Crear Historia Clínica</h1>

        <p>
          Complete los datos médicos del paciente.
        </p>
      </div>

      {error && (
        <div className="mensaje-error">
          {error}
        </div>
      )}

      <form onSubmit={guardarHistoria}>

        {/* MÉDICO */}

        <section className="historia-card">

          <h2>👨‍⚕️ Médico de cabecera</h2>

          <div className="datos-grid">

            <div>
              <label>Médico</label>

              <input
                type="text"
                name="medico_cabecera"
                value={formulario.medico_cabecera}
                onChange={manejarCambio}
              />
            </div>

            <div>
              <label>Teléfono</label>

              <input
                type="text"
                name="telefono_medico"
                value={formulario.telefono_medico}
                onChange={manejarCambio}
              />
            </div>

          </div>

        </section>

        {/* ANTECEDENTES */}

        <section className="historia-card">

          <h2>🚑 Antecedentes médicos</h2>

          <label>
            <input
              type="checkbox"
              name="servicio_urgencia"
              checked={formulario.servicio_urgencia}
              onChange={manejarCambio}
            />
            ¿Ha utilizado servicios de urgencia?
          </label>

          {formulario.servicio_urgencia && (
            <input
              type="text"
              name="servicio_urgencia_cual"
              placeholder="¿Cuál?"
              value={
                formulario.servicio_urgencia_cual
              }
              onChange={manejarCambio}
            />
          )}

          <label>
            <input
              type="checkbox"
              name="hospitalizacion"
              checked={formulario.hospitalizacion}
              onChange={manejarCambio}
            />
            ¿Ha sido hospitalizado?
          </label>

          {formulario.hospitalizacion && (
            <input
              type="text"
              name="hospitalizacion_motivo"
              placeholder="Motivo de hospitalización"
              value={
                formulario.hospitalizacion_motivo
              }
              onChange={manejarCambio}
            />
          )}

          <label>
            <input
              type="checkbox"
              name="tratamiento_medico"
              checked={formulario.tratamiento_medico}
              onChange={manejarCambio}
            />
            ¿Está bajo tratamiento médico?
          </label>

          {formulario.tratamiento_medico && (
            <input
              type="text"
              name="tratamiento_medico_cual"
              placeholder="Tratamiento"
              value={
                formulario.tratamiento_medico_cual
              }
              onChange={manejarCambio}
            />
          )}

        </section>

        {/* ALERGIAS */}

        <section className="historia-card">

          <h2>💊 Alergias y medicamentos</h2>

          <label>
            <input
              type="checkbox"
              name="alergias_medicamentos"
              checked={
                formulario.alergias_medicamentos
              }
              onChange={manejarCambio}
            />
            ¿Tiene alergias a medicamentos?
          </label>

          {formulario.alergias_medicamentos && (
            <input
              type="text"
              name="alergias_cuales"
              placeholder="¿Cuáles?"
              value={formulario.alergias_cuales}
              onChange={manejarCambio}
            />
          )}

          <label>
            <input
              type="checkbox"
              name="sangrado_excesivo"
              checked={formulario.sangrado_excesivo}
              onChange={manejarCambio}
            />
            ¿Presenta sangrado excesivo?
          </label>

          <label>
            <input
              type="checkbox"
              name="toma_medicamentos"
              checked={formulario.toma_medicamentos}
              onChange={manejarCambio}
            />
            ¿Toma medicamentos actualmente?
          </label>

          {formulario.toma_medicamentos && (
            <input
              type="text"
              name="medicamentos_cuales"
              placeholder="¿Cuáles medicamentos?"
              value={
                formulario.medicamentos_cuales
              }
              onChange={manejarCambio}
            />
          )}

        </section>

        {/* AFECCIONES */}

        <section className="historia-card">

          <h2>🩺 Afecciones médicas</h2>

          <textarea
            name="afecciones"
            placeholder="Indique enfermedades o afecciones médicas"
            value={formulario.afecciones}
            onChange={manejarCambio}
          />

        </section>

        {/* HÁBITOS */}

        <section className="historia-card">

          <h2>🚬 Hábitos</h2>

          <label>
            <input
              type="checkbox"
              name="cansancio_al_caminar"
              checked={
                formulario.cansancio_al_caminar
              }
              onChange={manejarCambio}
            />
            ¿Presenta cansancio al caminar?
          </label>

          <label>
            <input
              type="checkbox"
              name="fuma"
              checked={formulario.fuma}
              onChange={manejarCambio}
            />
            ¿Fuma?
          </label>

          {formulario.fuma && (
            <input
              type="text"
              name="cantidad_tabaco"
              placeholder="Cantidad de tabaco"
              value={formulario.cantidad_tabaco}
              onChange={manejarCambio}
            />
          )}

          <label>
            <input
              type="checkbox"
              name="bebe_alcohol"
              checked={formulario.bebe_alcohol}
              onChange={manejarCambio}
            />
            ¿Consume alcohol?
          </label>

          {formulario.bebe_alcohol && (
            <input
              type="text"
              name="cantidad_alcohol"
              placeholder="Cantidad de alcohol"
              value={formulario.cantidad_alcohol}
              onChange={manejarCambio}
            />
          )}

        </section>

        {/* EMBARAZO */}

        <section className="historia-card">

          <h2>🤰 Embarazo</h2>

          <label>
            <input
              type="checkbox"
              name="embarazo"
              checked={formulario.embarazo}
              onChange={manejarCambio}
            />
            ¿Está embarazada?
          </label>

          {formulario.embarazo && (
            <input
              type="text"
              name="embarazo_tiempo"
              placeholder="Tiempo de embarazo"
              value={formulario.embarazo_tiempo}
              onChange={manejarCambio}
            />
          )}

        </section>

        {/* RADIACIÓN */}

        <section className="historia-card">

          <h2>☢️ Radiación</h2>

          <label>
            <input
              type="checkbox"
              name="radiacion"
              checked={formulario.radiacion}
              onChange={manejarCambio}
            />
            ¿Ha recibido radiación?
          </label>

        </section>

        {/* OTROS */}

        <section className="historia-card">

          <h2>📝 Otros datos</h2>

          <label>
            <input
              type="checkbox"
              name="informe_medico"
              checked={formulario.informe_medico}
              onChange={manejarCambio}
            />
            ¿Presenta informe médico?
          </label>

          <textarea
            name="otros_datos"
            placeholder="Otros datos"
            value={formulario.otros_datos}
            onChange={manejarCambio}
          />

          <textarea
            name="observaciones"
            placeholder="Observaciones"
            value={formulario.observaciones}
            onChange={manejarCambio}
          />

        </section>

        {/* BOTÓN */}

        <div className="botones-historia">

          <button
            type="submit"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "💾 Guardar historia clínica"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default CrearHistoriaClinica;