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

return ( <div className="crear-historia-page">


  {/* ENCABEZADO */}

  <div className="pagina-encabezado">

    <div className="titulo-con-icono">

      <div className="pagina-icono">
        📋
      </div>

      <div>
        <h1>Crear Historia Clínica</h1>

        <p>
          Complete los datos médicos del paciente.
        </p>
      </div>

    </div>

  </div>


  {/* ERROR */}

  {error && (
    <div className="crear-historia-error">
      ⚠️ {error}
    </div>
  )}


  <form
    className="formulario-historia"
    onSubmit={guardarHistoria}
  >

    {/* MÉDICO */}

    <section className="crear-historia-card">

      <div className="crear-card-titulo">

        <div className="crear-seccion-icono">
          🩺
        </div>

        <div>
          <h2>Médico de cabecera</h2>

          <span>
            Información del médico de cabecera
          </span>
        </div>

      </div>


      <div className="crear-form-grid">

        <div className="campo-historia">

          <label>
            Médico
          </label>

          <input
            type="text"
            name="medico_cabecera"
            value={formulario.medico_cabecera}
            onChange={manejarCambio}
            placeholder="Nombre del médico"
          />

        </div>


        <div className="campo-historia">

          <label>
            Teléfono
          </label>

          <input
            type="text"
            name="telefono_medico"
            value={formulario.telefono_medico}
            onChange={manejarCambio}
            placeholder="Teléfono"
          />

        </div>

      </div>

    </section>


    {/* ANTECEDENTES */}

    <section className="crear-historia-card">

      <div className="crear-card-titulo">

        <div className="crear-seccion-icono">
          🚑
        </div>

        <div>
          <h2>Antecedentes médicos</h2>

          <span>
            Información sobre antecedentes
          </span>
        </div>

      </div>


      <div className="preguntas-historia">

        <label className="check-historia">

          <input
            type="checkbox"
            name="servicio_urgencia"
            checked={formulario.servicio_urgencia}
            onChange={manejarCambio}
          />

          <span>
            ¿Ha utilizado servicios de urgencia?
          </span>

        </label>


        {formulario.servicio_urgencia && (
          <input
            className="input-condicional"
            type="text"
            name="servicio_urgencia_cual"
            placeholder="¿Cuál?"
            value={
              formulario.servicio_urgencia_cual
            }
            onChange={manejarCambio}
          />
        )}


        <label className="check-historia">

          <input
            type="checkbox"
            name="hospitalizacion"
            checked={formulario.hospitalizacion}
            onChange={manejarCambio}
          />

          <span>
            ¿Ha sido hospitalizado?
          </span>

        </label>


        {formulario.hospitalizacion && (
          <input
            className="input-condicional"
            type="text"
            name="hospitalizacion_motivo"
            placeholder="Motivo de hospitalización"
            value={
              formulario.hospitalizacion_motivo
            }
            onChange={manejarCambio}
          />
        )}


        <label className="check-historia">

          <input
            type="checkbox"
            name="tratamiento_medico"
            checked={formulario.tratamiento_medico}
            onChange={manejarCambio}
          />

          <span>
            ¿Está bajo tratamiento médico?
          </span>

        </label>


        {formulario.tratamiento_medico && (
          <input
            className="input-condicional"
            type="text"
            name="tratamiento_medico_cual"
            placeholder="Indique el tratamiento"
            value={
              formulario.tratamiento_medico_cual
            }
            onChange={manejarCambio}
          />
        )}

      </div>

    </section>


    {/* ALERGIAS Y MEDICAMENTOS */}

    <section className="crear-historia-card">

      <div className="crear-card-titulo">

        <div className="crear-seccion-icono">
          💊
        </div>

        <div>
          <h2>Alergias y medicamentos</h2>

          <span>
            Información importante para la atención
          </span>
        </div>

      </div>


      <div className="preguntas-historia">

        <label className="check-historia">

          <input
            type="checkbox"
            name="alergias_medicamentos"
            checked={
              formulario.alergias_medicamentos
            }
            onChange={manejarCambio}
          />

          <span>
            ¿Tiene alergias a medicamentos?
          </span>

        </label>


        {formulario.alergias_medicamentos && (
          <input
            className="input-condicional"
            type="text"
            name="alergias_cuales"
            placeholder="¿Cuáles?"
            value={formulario.alergias_cuales}
            onChange={manejarCambio}
          />
        )}


        <label className="check-historia">

          <input
            type="checkbox"
            name="sangrado_excesivo"
            checked={formulario.sangrado_excesivo}
            onChange={manejarCambio}
          />

          <span>
            ¿Presenta sangrado excesivo?
          </span>

        </label>


        <label className="check-historia">

          <input
            type="checkbox"
            name="toma_medicamentos"
            checked={formulario.toma_medicamentos}
            onChange={manejarCambio}
          />

          <span>
            ¿Toma medicamentos actualmente?
          </span>

        </label>


        {formulario.toma_medicamentos && (
          <input
            className="input-condicional"
            type="text"
            name="medicamentos_cuales"
            placeholder="¿Cuáles medicamentos?"
            value={
              formulario.medicamentos_cuales
            }
            onChange={manejarCambio}
          />
        )}

      </div>

    </section>


    {/* AFECCIONES */}

    <section className="crear-historia-card">

      <div className="crear-card-titulo">

        <div className="crear-seccion-icono">
          ❤️
        </div>

        <div>
          <h2>Afecciones médicas</h2>

          <span>
            Enfermedades o condiciones médicas
          </span>
        </div>

      </div>


      <textarea
        className="textarea-historia"
        name="afecciones"
        placeholder="Indique enfermedades o afecciones médicas"
        value={formulario.afecciones}
        onChange={manejarCambio}
      />

    </section>


    {/* HÁBITOS */}

    <section className="crear-historia-card">

      <div className="crear-card-titulo">

        <div className="crear-seccion-icono">
          🌿
        </div>

        <div>
          <h2>Hábitos</h2>

          <span>
            Información sobre hábitos
          </span>
        </div>

      </div>


      <div className="preguntas-historia">

        <label className="check-historia">

          <input
            type="checkbox"
            name="cansancio_al_caminar"
            checked={
              formulario.cansancio_al_caminar
            }
            onChange={manejarCambio}
          />

          <span>
            ¿Presenta cansancio al caminar?
          </span>

        </label>


        <label className="check-historia">

          <input
            type="checkbox"
            name="fuma"
            checked={formulario.fuma}
            onChange={manejarCambio}
          />

          <span>
            ¿Fuma?
          </span>

        </label>


        {formulario.fuma && (
          <input
            className="input-condicional"
            type="text"
            name="cantidad_tabaco"
            placeholder="Cantidad de tabaco"
            value={formulario.cantidad_tabaco}
            onChange={manejarCambio}
          />
        )}


        <label className="check-historia">

          <input
            type="checkbox"
            name="bebe_alcohol"
            checked={formulario.bebe_alcohol}
            onChange={manejarCambio}
          />

          <span>
            ¿Consume alcohol?
          </span>

        </label>


        {formulario.bebe_alcohol && (
          <input
            className="input-condicional"
            type="text"
            name="cantidad_alcohol"
            placeholder="Cantidad de alcohol"
            value={formulario.cantidad_alcohol}
            onChange={manejarCambio}
          />
        )}

      </div>

    </section>


    {/* EMBARAZO */}

    <section className="crear-historia-card">

      <div className="crear-card-titulo">

        <div className="crear-seccion-icono">
          🤰
        </div>

        <div>
          <h2>Embarazo</h2>

          <span>
            Información relacionada
          </span>
        </div>

      </div>


      <div className="preguntas-historia">

        <label className="check-historia">

          <input
            type="checkbox"
            name="embarazo"
            checked={formulario.embarazo}
            onChange={manejarCambio}
          />

          <span>
            ¿Está embarazada?
          </span>

        </label>


        {formulario.embarazo && (
          <input
            className="input-condicional"
            type="text"
            name="embarazo_tiempo"
            placeholder="Tiempo de embarazo"
            value={formulario.embarazo_tiempo}
            onChange={manejarCambio}
          />
        )}

      </div>

    </section>


    {/* RADIACIÓN */}

    <section className="crear-historia-card">

      <div className="crear-card-titulo">

        <div className="crear-seccion-icono">
          ☢️
        </div>

        <div>
          <h2>Radiación</h2>

          <span>
            Antecedentes de exposición
          </span>
        </div>

      </div>


      <label className="check-historia">

        <input
          type="checkbox"
          name="radiacion"
          checked={formulario.radiacion}
          onChange={manejarCambio}
        />

        <span>
          ¿Ha recibido radiación?
        </span>

      </label>

    </section>


    {/* OTROS DATOS */}

    <section className="crear-historia-card">

      <div className="crear-card-titulo">

        <div className="crear-seccion-icono">
          📄
        </div>

        <div>
          <h2>Otros datos</h2>

          <span>
            Información adicional
          </span>
        </div>

      </div>


      <div className="preguntas-historia">

        <label className="check-historia">

          <input
            type="checkbox"
            name="informe_medico"
            checked={formulario.informe_medico}
            onChange={manejarCambio}
          />

          <span>
            ¿Presenta informe médico?
          </span>

        </label>

      </div>


      <textarea
        className="textarea-historia"
        name="otros_datos"
        placeholder="Otros datos"
        value={formulario.otros_datos}
        onChange={manejarCambio}
      />


      <textarea
        className="textarea-historia"
        name="observaciones"
        placeholder="Observaciones"
        value={formulario.observaciones}
        onChange={manejarCambio}
      />

    </section>


    {/* BOTONES */}

    <div className="crear-historia-acciones">

      <button
        type="button"
        className="btn-crear btn-cancelar-crear"
        onClick={() =>
          navigate(`/historias-clinicas/${id}`)
        }
      >
        ← Cancelar
      </button>


      <button
        type="submit"
        className="btn-crear btn-guardar-crear"
        disabled={guardando}
      >
        {guardando
          ? "⏳ Guardando..."
          : "💾 Guardar historia clínica"}
      </button>

    </div>

  </form>

</div>


);
}

export default CrearHistoriaClinica;
