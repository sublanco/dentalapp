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
      <div style={{ padding: "30px" }}>
        <h2>Editando Historia Clínica 🦷</h2>
        <p>Cargando información...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "25px",
      }}
    >
      <h1>Editar Historia Clínica 🦷</h1>

      <form onSubmit={guardarCambios}>

        {/* MÉDICO */}
        <section
          style={{
            marginTop: "25px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
          }}
        >
          <h2>Datos médicos</h2>

          <label>Médico de cabecera</label>
          <input
            type="text"
            name="medico_cabecera"
            value={formulario.medico_cabecera}
            onChange={manejarCambio}
            style={{ width: "100%", marginBottom: "15px" }}
          />

          <label>Teléfono del médico</label>
          <input
            type="text"
            name="telefono_medico"
            value={formulario.telefono_medico}
            onChange={manejarCambio}
            style={{ width: "100%", marginBottom: "15px" }}
          />

          <label>
            <input
              type="checkbox"
              name="servicio_urgencia"
              checked={formulario.servicio_urgencia}
              onChange={manejarCambio}
            />
            {" "}¿Tiene servicio de urgencia?
          </label>

          {formulario.servicio_urgencia && (
            <input
              type="text"
              name="servicio_urgencia_cual"
              placeholder="¿Cuál?"
              value={formulario.servicio_urgencia_cual}
              onChange={manejarCambio}
              style={{ width: "100%", marginTop: "10px" }}
            />
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

          <label>
            <input
              type="checkbox"
              name="hospitalizacion"
              checked={formulario.hospitalizacion}
              onChange={manejarCambio}
            />
            {" "}¿Fue hospitalizado?
          </label>

          {formulario.hospitalizacion && (
            <input
              type="text"
              name="hospitalizacion_motivo"
              placeholder="Motivo de hospitalización"
              value={formulario.hospitalizacion_motivo}
              onChange={manejarCambio}
              style={{ width: "100%", marginTop: "10px" }}
            />
          )}

          <br />
          <br />

          <label>
            <input
              type="checkbox"
              name="tratamiento_medico"
              checked={formulario.tratamiento_medico}
              onChange={manejarCambio}
            />
            {" "}¿Está realizando algún tratamiento médico?
          </label>

          {formulario.tratamiento_medico && (
            <input
              type="text"
              name="tratamiento_medico_cual"
              placeholder="¿Cuál?"
              value={formulario.tratamiento_medico_cual}
              onChange={manejarCambio}
              style={{ width: "100%", marginTop: "10px" }}
            />
          )}

          <br />
          <br />

          <label>
            <input
              type="checkbox"
              name="alergias_medicamentos"
              checked={formulario.alergias_medicamentos}
              onChange={manejarCambio}
            />
            {" "}¿Tiene alergias a medicamentos?
          </label>

          {formulario.alergias_medicamentos && (
            <input
              type="text"
              name="alergias_cuales"
              placeholder="¿Cuáles?"
              value={formulario.alergias_cuales}
              onChange={manejarCambio}
              style={{ width: "100%", marginTop: "10px" }}
            />
          )}

          <br />
          <br />

          <label>
            <input
              type="checkbox"
              name="sangrado_excesivo"
              checked={formulario.sangrado_excesivo}
              onChange={manejarCambio}
            />
            {" "}¿Tiene antecedentes de sangrado excesivo?
          </label>
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

          <textarea
            name="afecciones"
            value={formulario.afecciones}
            onChange={manejarCambio}
            placeholder="Ejemplo: Diabetes, hipertensión, asma"
            rows="4"
            style={{ width: "100%" }}
          />
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

          <label>
            <input
              type="checkbox"
              name="toma_medicamentos"
              checked={formulario.toma_medicamentos}
              onChange={manejarCambio}
            />
            {" "}¿Toma medicamentos?
          </label>

          {formulario.toma_medicamentos && (
            <textarea
              name="medicamentos_cuales"
              value={formulario.medicamentos_cuales}
              onChange={manejarCambio}
              placeholder="Indique cuáles"
              rows="3"
              style={{
                width: "100%",
                marginTop: "10px",
              }}
            />
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

          <label>
            <input
              type="checkbox"
              name="cansancio_al_caminar"
              checked={formulario.cansancio_al_caminar}
              onChange={manejarCambio}
            />
            {" "}¿Tiene cansancio al caminar?
          </label>

          <br />
          <br />

          <label>
            <input
              type="checkbox"
              name="fuma"
              checked={formulario.fuma}
              onChange={manejarCambio}
            />
            {" "}¿Fuma?
          </label>

          {formulario.fuma && (
            <input
              type="text"
              name="cantidad_tabaco"
              placeholder="Cantidad de cigarrillos"
              value={formulario.cantidad_tabaco}
              onChange={manejarCambio}
              style={{
                width: "100%",
                marginTop: "10px",
              }}
            />
          )}

          <br />
          <br />

          <label>
            <input
              type="checkbox"
              name="bebe_alcohol"
              checked={formulario.bebe_alcohol}
              onChange={manejarCambio}
            />
            {" "}¿Consume alcohol?
          </label>

          {formulario.bebe_alcohol && (
            <input
              type="text"
              name="cantidad_alcohol"
              placeholder="Cantidad / frecuencia"
              value={formulario.cantidad_alcohol}
              onChange={manejarCambio}
              style={{
                width: "100%",
                marginTop: "10px",
              }}
            />
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

          <label>
            <input
              type="checkbox"
              name="embarazo"
              checked={formulario.embarazo}
              onChange={manejarCambio}
            />
            {" "}¿Está embarazada?
          </label>

          {formulario.embarazo && (
            <input
              type="text"
              name="embarazo_tiempo"
              placeholder="Tiempo de embarazo"
              value={formulario.embarazo_tiempo}
              onChange={manejarCambio}
              style={{
                width: "100%",
                marginTop: "10px",
              }}
            />
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

          <label>
            <input
              type="checkbox"
              name="radiacion"
              checked={formulario.radiacion}
              onChange={manejarCambio}
            />
            {" "}¿Estuvo expuesto/a a radiación?
          </label>
        </section>

        {/* OTROS DATOS */}
        <section
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
          }}
        >
          <h2>Otros datos</h2>

          <textarea
            name="otros_datos"
            value={formulario.otros_datos}
            onChange={manejarCambio}
            rows="4"
            style={{ width: "100%" }}
            placeholder="Otros datos importantes"
          />
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

          <label>
            <input
              type="checkbox"
              name="informe_medico"
              checked={formulario.informe_medico}
              onChange={manejarCambio}
            />
            {" "}¿Presenta informe médico?
          </label>

          <br />
          <br />

          <textarea
            name="observaciones"
            value={formulario.observaciones}
            onChange={manejarCambio}
            rows="4"
            style={{ width: "100%" }}
            placeholder="Observaciones"
          />
        </section>

        {/* BOTONES */}
        <div style={{ marginTop: "30px" }}>
          <button
            type="submit"
            disabled={guardando}
            style={{
              padding: "12px 25px",
              backgroundColor: "#198754",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            {guardando ? "Guardando..." : "💾 Guardar cambios"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(`/historias-clinicas/${id}`)
            }
            style={{
              padding: "12px 25px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarHistoriaClinica;