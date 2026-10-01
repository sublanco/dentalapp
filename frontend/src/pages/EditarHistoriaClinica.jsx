import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function EditarHistoriaClinica() {
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

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerHistoria();
  }, [id]);

  async function obtenerHistoria() {
    try {
      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/historias-clinicas/${id}`
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo obtener la historia clínica");
      }

      const datos = await respuesta.json();

      setFormulario({
        medico_cabecera: datos.medico_cabecera || "",
        telefono_medico: datos.telefono_medico || "",

        servicio_urgencia:
          datos.servicio_urgencia === true ||
          datos.servicio_urgencia === 1,

        servicio_urgencia_cual:
          datos.servicio_urgencia_cual || "",

        hospitalizacion:
          datos.hospitalizacion === true ||
          datos.hospitalizacion === 1,

        hospitalizacion_motivo:
          datos.hospitalizacion_motivo || "",

        tratamiento_medico:
          datos.tratamiento_medico === true ||
          datos.tratamiento_medico === 1,

        tratamiento_medico_cual:
          datos.tratamiento_medico_cual || "",

        alergias_medicamentos:
          datos.alergias_medicamentos === true ||
          datos.alergias_medicamentos === 1,

        alergias_cuales:
          datos.alergias_cuales || "",

        sangrado_excesivo:
          datos.sangrado_excesivo === true ||
          datos.sangrado_excesivo === 1,

        afecciones: Array.isArray(datos.afecciones)
          ? datos.afecciones.join(", ")
          : datos.afecciones || "",

        toma_medicamentos:
          datos.toma_medicamentos === true ||
          datos.toma_medicamentos === 1,

        medicamentos_cuales:
          datos.medicamentos_cuales || "",

        cansancio_al_caminar:
          datos.cansancio_al_caminar === true ||
          datos.cansancio_al_caminar === 1,

        fuma:
          datos.fuma === true ||
          datos.fuma === 1,

        cantidad_tabaco:
          datos.cantidad_tabaco || "",

        bebe_alcohol:
          datos.bebe_alcohol === true ||
          datos.bebe_alcohol === 1,

        cantidad_alcohol:
          datos.cantidad_alcohol || "",

        embarazo:
          datos.embarazo === true ||
          datos.embarazo === 1,

        embarazo_tiempo:
          datos.embarazo_tiempo || "",

        radiacion:
          datos.radiacion === true ||
          datos.radiacion === 1,

        otros_datos:
          datos.otros_datos || "",

        informe_medico:
          datos.informe_medico === true ||
          datos.informe_medico === 1,

        observaciones:
          datos.observaciones || "",
      });
    } catch (error) {
      console.error(error);
      alert("No se pudo cargar la historia clínica");
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    const { name, value, type, checked } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function guardarCambios(e) {
    e.preventDefault();

    try {
      setGuardando(true);

      const datos = {
        ...formulario,

        afecciones: formulario.afecciones
          ? formulario.afecciones
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item !== "")
          : [],
      };

      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/historias-clinicas/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(datos),
        }
      );

      if (!respuesta.ok) {
        const error = await respuesta.text();
        console.error(error);
        throw new Error("No se pudieron guardar los cambios");
      }

      alert("Historia clínica actualizada correctamente");

      navigate(`/historias-clinicas/${id}`);
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar los cambios");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <div className="editar-historia-cargando">
        <div className="editar-cargando-icono">🦷</div>

        <h2>Editando Historia Clínica</h2>

        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div className="editar-historia-page">

      {/* ENCABEZADO */}
      <div className="pagina-encabezado">

        <div className="titulo-con-icono">

          <div className="pagina-icono">
            ✏️
          </div>

          <div>
            <h1>
              Editar Historia Clínica
            </h1>

            <p>
              Actualizá la información clínica del paciente
            </p>
          </div>

        </div>

      </div>


      <form
        className="formulario-historia"
        onSubmit={guardarCambios}
      >

        {/* DATOS MÉDICOS */}
        <section className="editar-historia-card">

          <div className="editar-card-titulo">
            <span className="editar-seccion-icono">
              🩺
            </span>

            <h2>
              Datos médicos
            </h2>
          </div>


          <div className="editar-form-grid">

            <div className="campo-historia">

              <label>
                Médico de cabecera
              </label>

              <input
                type="text"
                name="medico_cabecera"
                value={formulario.medico_cabecera}
                onChange={manejarCambio}
              />

            </div>


            <div className="campo-historia">

              <label>
                Teléfono del médico
              </label>

              <input
                type="text"
                name="telefono_medico"
                value={formulario.telefono_medico}
                onChange={manejarCambio}
              />

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
                ¿Tiene servicio de urgencia?
              </span>

            </label>


            {formulario.servicio_urgencia && (
              <input
                className="input-condicional"
                type="text"
                name="servicio_urgencia_cual"
                placeholder="¿Cuál?"
                value={formulario.servicio_urgencia_cual}
                onChange={manejarCambio}
              />
            )}

          </div>

        </section>


        {/* ANTECEDENTES */}
        <section className="editar-historia-card">

          <div className="editar-card-titulo">
            <span className="editar-seccion-icono">
              📋
            </span>

            <h2>
              Antecedentes
            </h2>
          </div>


          <div className="preguntas-historia">

            <label className="check-historia">

              <input
                type="checkbox"
                name="hospitalizacion"
                checked={formulario.hospitalizacion}
                onChange={manejarCambio}
              />

              <span>
                ¿Fue hospitalizado?
              </span>

            </label>


            {formulario.hospitalizacion && (
              <input
                className="input-condicional"
                type="text"
                name="hospitalizacion_motivo"
                placeholder="Motivo de hospitalización"
                value={formulario.hospitalizacion_motivo}
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
                ¿Está realizando algún tratamiento médico?
              </span>

            </label>


            {formulario.tratamiento_medico && (
              <input
                className="input-condicional"
                type="text"
                name="tratamiento_medico_cual"
                placeholder="¿Cuál?"
                value={formulario.tratamiento_medico_cual}
                onChange={manejarCambio}
              />
            )}


            <label className="check-historia">

              <input
                type="checkbox"
                name="alergias_medicamentos"
                checked={formulario.alergias_medicamentos}
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
                ¿Tiene antecedentes de sangrado excesivo?
              </span>

            </label>

          </div>

        </section>


        {/* AFECCIONES */}
        <section className="editar-historia-card">

          <div className="editar-card-titulo">
            <span className="editar-seccion-icono">
              🩹
            </span>

            <h2>
              Afecciones
            </h2>
          </div>


          <div className="campo-historia">

            <label>
              Afecciones o enfermedades
            </label>

            <textarea
              name="afecciones"
              value={formulario.afecciones}
              onChange={manejarCambio}
              placeholder="Ejemplo: Diabetes, hipertensión, asma"
              rows="4"
            />

            <small>
              Si hay varias, separalas con comas.
            </small>

          </div>

        </section>


        {/* MEDICAMENTOS */}
        <section className="editar-historia-card">

          <div className="editar-card-titulo">
            <span className="editar-seccion-icono">
              💊
            </span>

            <h2>
              Medicamentos
            </h2>
          </div>


          <div className="preguntas-historia">

            <label className="check-historia">

              <input
                type="checkbox"
                name="toma_medicamentos"
                checked={formulario.toma_medicamentos}
                onChange={manejarCambio}
              />

              <span>
                ¿Toma medicamentos?
              </span>

            </label>


            {formulario.toma_medicamentos && (
              <textarea
                className="textarea-condicional"
                name="medicamentos_cuales"
                value={formulario.medicamentos_cuales}
                onChange={manejarCambio}
                placeholder="Indique cuáles"
                rows="3"
              />
            )}

          </div>

        </section>


        {/* HÁBITOS */}
        <section className="editar-historia-card">

          <div className="editar-card-titulo">
            <span className="editar-seccion-icono">
              🌿
            </span>

            <h2>
              Hábitos
            </h2>
          </div>


          <div className="preguntas-historia">

            <label className="check-historia">

              <input
                type="checkbox"
                name="cansancio_al_caminar"
                checked={formulario.cansancio_al_caminar}
                onChange={manejarCambio}
              />

              <span>
                ¿Tiene cansancio al caminar?
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
                placeholder="Cantidad de cigarrillos"
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
                placeholder="Cantidad / frecuencia"
                value={formulario.cantidad_alcohol}
                onChange={manejarCambio}
              />
            )}

          </div>

        </section>


        {/* EMBARAZO */}
        <section className="editar-historia-card">

          <div className="editar-card-titulo">
            <span className="editar-seccion-icono">
              🤰
            </span>

            <h2>
              Embarazo
            </h2>
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
        <section className="editar-historia-card">

          <div className="editar-card-titulo">
            <span className="editar-seccion-icono">
              ☢️
            </span>

            <h2>
              Radiación
            </h2>
          </div>


          <label className="check-historia">

            <input
              type="checkbox"
              name="radiacion"
              checked={formulario.radiacion}
              onChange={manejarCambio}
            />

            <span>
              ¿Estuvo expuesto/a a radiación?
            </span>

          </label>

        </section>


        {/* OTROS DATOS */}
        <section className="editar-historia-card">

          <div className="editar-card-titulo">
            <span className="editar-seccion-icono">
              📝
            </span>

            <h2>
              Otros datos
            </h2>
          </div>


          <div className="campo-historia">

            <label>
              Información adicional
            </label>

            <textarea
              name="otros_datos"
              value={formulario.otros_datos}
              onChange={manejarCambio}
              rows="4"
              placeholder="Otros datos importantes"
            />

          </div>

        </section>


        {/* INFORME MÉDICO */}
        <section className="editar-historia-card">

          <div className="editar-card-titulo">
            <span className="editar-seccion-icono">
              📄
            </span>

            <h2>
              Informe médico
            </h2>
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


            <div className="campo-historia">

              <label>
                Observaciones
              </label>

              <textarea
                name="observaciones"
                value={formulario.observaciones}
                onChange={manejarCambio}
                rows="4"
                placeholder="Observaciones"
              />

            </div>

          </div>

        </section>


        {/* BOTONES */}
        <div className="editar-historia-acciones">

          <button
            type="submit"
            disabled={guardando}
            className="btn-editar-guardar"
          >
            {guardando
              ? "Guardando..."
              : "💾 Guardar cambios"}
          </button>


          <button
            type="button"
            onClick={() =>
              navigate(`/historias-clinicas/${id}`)
            }
            className="btn-editar-cancelar"
          >
            ← Cancelar
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditarHistoriaClinica;