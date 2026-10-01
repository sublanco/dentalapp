import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

function Consultas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [consultas, setConsultas] = useState([]);
  const [paciente, setPaciente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [consultaEditando, setConsultaEditando] = useState(null);

  const [fechaConsulta, setFechaConsulta] = useState("");
  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const respuestaPaciente = await fetch(
        `http://127.0.0.1:8000/api/pacientes/${id}`
      );

      if (!respuestaPaciente.ok) {
        throw new Error("No se pudo obtener el paciente");
      }

      const datosPaciente = await respuestaPaciente.json();
      setPaciente(datosPaciente);

      const respuestaConsultas = await fetch(
        "http://127.0.0.1:8000/api/consultas"
      );

      if (!respuestaConsultas.ok) {
        throw new Error("No se pudieron obtener las consultas");
      }

      const datosConsultas = await respuestaConsultas.json();

      const consultasPaciente = datosConsultas.filter(
        (consulta) => consulta.paciente_id === Number(id)
      );

      setConsultas(consultasPaciente);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los datos.");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFechaConsulta("");
    setMotivoConsulta("");
    setDiagnostico("");
    setTratamiento("");
    setObservaciones("");
  }

  function nuevaConsulta() {
    limpiarFormulario();

    const hoy = new Date().toISOString().split("T")[0];
    setFechaConsulta(hoy);

    setConsultaEditando(null);
    setMostrarFormulario(true);
  }

  function cancelarFormulario() {
    limpiarFormulario();
    setMostrarFormulario(false);
    setConsultaEditando(null);
  }

  function editarConsulta(consulta) {
    setConsultaEditando(consulta);

    setFechaConsulta(consulta.fecha_consulta);
    setMotivoConsulta(consulta.motivo_consulta);
    setDiagnostico(consulta.diagnostico || "");
    setTratamiento(consulta.tratamiento || "");
    setObservaciones(consulta.observaciones || "");

    setMostrarFormulario(true);
  }

  async function eliminarConsulta(consulta) {
    const confirmar = window.confirm(
      "¿Está segura de que desea eliminar esta consulta?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/consultas/${consulta.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        console.error("Error del servidor:", datos);
        alert("No se pudo eliminar la consulta");
        return;
      }

      alert("Consulta eliminada correctamente");

      await cargarDatos();
    } catch (error) {
      console.error("Error al eliminar consulta:", error);
      alert("No se pudo conectar con el servidor");
    }
  }

  async function guardarConsulta(e) {
    e.preventDefault();

    const datosConsulta = {
      paciente_id: Number(id),
      fecha_consulta: fechaConsulta,
      motivo_consulta: motivoConsulta,
      diagnostico: diagnostico || null,
      tratamiento: tratamiento || null,
      observaciones: observaciones || null,
    };

    try {
      if (consultaEditando) {
        const respuesta = await fetch(
          `http://127.0.0.1:8000/api/consultas/${consultaEditando.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(datosConsulta),
          }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          console.error("Error del servidor:", datos);
          alert("No se pudo actualizar la consulta");
          return;
        }

        alert("Consulta actualizada correctamente");
      } else {
        const respuesta = await fetch(
          "http://127.0.0.1:8000/api/consultas",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(datosConsulta),
          }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          console.error("Error del servidor:", datos);
          alert("No se pudo guardar la consulta");
          return;
        }

        alert("Consulta guardada correctamente");
      }

      limpiarFormulario();
      setMostrarFormulario(false);
      setConsultaEditando(null);

      await cargarDatos();
    } catch (error) {
      console.error("Error al guardar consulta:", error);
      alert("No se pudo conectar con el servidor");
    }
  }

  function volver() {
    navigate("/pacientes");
  }

  if (cargando) {
    return (
      <div className="consultas-cargando">
        <div className="consultas-cargando-icono">
          🦷
        </div>

        <h2>
          Cargando consultas
        </h2>

        <p>
          Espere un momento...
        </p>
      </div>
    );
  }

  return (
    <div className="consultas-page">

      {/* ENCABEZADO */}

      <div className="consultas-encabezado">

        <div className="titulo-con-icono">

          <div className="pagina-icono">
            📅
          </div>

          <div>

            <h1>
              Consultas odontológicas
            </h1>

            {paciente && (
              <p>
                Paciente:{" "}
                <strong>
                  {paciente.nombre} {paciente.apellido}
                </strong>
              </p>
            )}

          </div>

        </div>


        <button
          className="btn-consultas-volver"
          onClick={volver}
        >
          ← Volver a pacientes
        </button>

      </div>


      {/* NUEVA CONSULTA */}

      {!mostrarFormulario && (
        <div className="consultas-nueva-contenedor">

          <button
            className="btn-nueva-consulta"
            onClick={nuevaConsulta}
          >
            ➕ Nueva consulta
          </button>

        </div>
      )}


      {/* FORMULARIO */}

      {mostrarFormulario && (
        <section className="consulta-form-card">

          <div className="consulta-form-titulo">

            <div className="consulta-form-icono">
              {consultaEditando ? "✏️" : "➕"}
            </div>

            <div>

              <h2>
                {consultaEditando
                  ? "Editar consulta"
                  : "Nueva consulta"}
              </h2>

              <p>
                {consultaEditando
                  ? "Modificá los datos de la consulta"
                  : "Registrá una nueva consulta odontológica"}
              </p>

            </div>

          </div>


          <form onSubmit={guardarConsulta}>

            <div className="consulta-form-grid">

              {/* FECHA */}

              <div className="campo-consulta campo-fecha">

                <label>
                  Fecha de consulta
                </label>

                <input
                  type="date"
                  value={fechaConsulta}
                  onChange={(e) =>
                    setFechaConsulta(e.target.value)
                  }
                  required
                />

              </div>


              {/* MOTIVO */}

              <div className="campo-consulta campo-completo">

                <label>
                  Motivo de consulta
                </label>

                <textarea
                  value={motivoConsulta}
                  onChange={(e) =>
                    setMotivoConsulta(e.target.value)
                  }
                  placeholder="¿Por qué consulta el paciente?"
                  rows="3"
                  required
                />

              </div>


              {/* DIAGNÓSTICO */}

              <div className="campo-consulta">

                <label>
                  Diagnóstico
                </label>

                <textarea
                  value={diagnostico}
                  onChange={(e) =>
                    setDiagnostico(e.target.value)
                  }
                  placeholder="Diagnóstico realizado"
                  rows="4"
                />

              </div>


              {/* TRATAMIENTO */}

              <div className="campo-consulta">

                <label>
                  Tratamiento
                </label>

                <textarea
                  value={tratamiento}
                  onChange={(e) =>
                    setTratamiento(e.target.value)
                  }
                  placeholder="Tratamiento indicado o realizado"
                  rows="4"
                />

              </div>


              {/* OBSERVACIONES */}

              <div className="campo-consulta campo-completo">

                <label>
                  Observaciones
                </label>

                <textarea
                  value={observaciones}
                  onChange={(e) =>
                    setObservaciones(e.target.value)
                  }
                  placeholder="Observaciones adicionales"
                  rows="4"
                />

              </div>

            </div>


            {/* BOTONES FORMULARIO */}

            <div className="consulta-form-acciones">

              <button
                type="submit"
                className="btn-guardar-consulta"
              >
                {consultaEditando
                  ? "💾 Actualizar consulta"
                  : "💾 Guardar consulta"}
              </button>

              <button
                type="button"
                className="btn-cancelar-consulta"
                onClick={cancelarFormulario}
              >
                Cancelar
              </button>

            </div>

          </form>

        </section>
      )}


      {/* ERROR */}

      {error && (
        <div className="consultas-error">
          ⚠️ {error}
        </div>
      )}


      {/* SIN CONSULTAS */}

      {!cargando &&
        !error &&
        consultas.length === 0 &&
        !mostrarFormulario && (
          <div className="consultas-vacia">

            <div className="consultas-vacia-icono">
              📅
            </div>

            <h2>
              No hay consultas registradas
            </h2>

            <p>
              Este paciente todavía no tiene consultas
              odontológicas registradas.
            </p>

            <button
              className="btn-nueva-consulta"
              onClick={nuevaConsulta}
            >
              ➕ Registrar primera consulta
            </button>

          </div>
        )}


      {/* HISTORIAL */}

      {!cargando &&
        !error &&
        consultas.length > 0 && (

          <section className="historial-consultas">

            <div className="historial-consultas-titulo">

              <div>
                <span className="historial-icono">
                  📋
                </span>

                <div>
                  <h2>
                    Historial de consultas
                  </h2>

                  <p>
                    {consultas.length}{" "}
                    {consultas.length === 1
                      ? "consulta registrada"
                      : "consultas registradas"}
                  </p>
                </div>
              </div>

            </div>


            <div className="consultas-listado">

              {consultas.map((consulta) => (

                <article
                  className="consulta-card-profesional"
                  key={consulta.id}
                >

                  <div className="consulta-card-header">

                    <div className="consulta-fecha">

                      <span className="consulta-fecha-icono">
                        📅
                      </span>

                      <div>

                        <span>
                          Fecha de consulta
                        </span>

                        <strong>
                          {new Date(
                            consulta.fecha_consulta + "T00:00:00"
                          ).toLocaleDateString("es-AR")}
                        </strong>

                      </div>

                    </div>


                    <div className="consulta-card-acciones">

                      <button
                        className="btn-consulta-editar"
                        onClick={() =>
                          editarConsulta(consulta)
                        }
                      >
                        ✏️ Editar
                      </button>

                      <button
                        className="btn-consulta-eliminar"
                        onClick={() =>
                          eliminarConsulta(consulta)
                        }
                      >
                        🗑️ Eliminar
                      </button>

                    </div>

                  </div>


                  <div className="consulta-datos-grid">

                    <div className="consulta-dato consulta-dato-principal">

                      <span>
                        Motivo de consulta
                      </span>

                      <p>
                        {consulta.motivo_consulta}
                      </p>

                    </div>


                    <div className="consulta-dato">

                      <span>
                        Diagnóstico
                      </span>

                      <p>
                        {consulta.diagnostico ||
                          "No registrado"}
                      </p>

                    </div>


                    <div className="consulta-dato">

                      <span>
                        Tratamiento
                      </span>

                      <p>
                        {consulta.tratamiento ||
                          "No registrado"}
                      </p>

                    </div>


                    <div className="consulta-dato">

                      <span>
                        Observaciones
                      </span>

                      <p>
                        {consulta.observaciones ||
                          "No registradas"}
                      </p>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          </section>
        )}

    </div>
  );
}

export default Consultas;