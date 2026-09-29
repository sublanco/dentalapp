import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

function Consultas() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [consultas, setConsultas] = useState([]);
    const [paciente, setPaciente] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // ==============================
    // FORMULARIO
    // ==============================

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [consultaEditando, setConsultaEditando] = useState(null);

    const [fechaConsulta, setFechaConsulta] = useState("");
    const [motivoConsulta, setMotivoConsulta] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [tratamiento, setTratamiento] = useState("");
    const [observaciones, setObservaciones] = useState("");

    // ==============================
    // CARGAR DATOS
    // ==============================

    useEffect(() => {
        cargarDatos();
    }, [id]);

    async function cargarDatos() {
        try {
            setCargando(true);
            setError("");

            // Obtener paciente
            const respuestaPaciente = await fetch(
                `http://127.0.0.1:8000/api/pacientes/${id}`
            );

            if (!respuestaPaciente.ok) {
                throw new Error("No se pudo obtener el paciente");
            }

            const datosPaciente = await respuestaPaciente.json();
            setPaciente(datosPaciente);

            // Obtener consultas
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

    // ==============================
    // LIMPIAR FORMULARIO
    // ==============================

    function limpiarFormulario() {
        setFechaConsulta("");
        setMotivoConsulta("");
        setDiagnostico("");
        setTratamiento("");
        setObservaciones("");
    }

    // ==============================
    // NUEVA CONSULTA
    // ==============================

    function nuevaConsulta() {
        limpiarFormulario();

        // Colocamos automáticamente la fecha actual
        const hoy = new Date().toISOString().split("T")[0];
        setFechaConsulta(hoy);

        setMostrarFormulario(true);
    }

    // ==============================
    // CANCELAR
    // ==============================

    function cancelarFormulario() {
        limpiarFormulario();
        setMostrarFormulario(false);
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

    // ==============================
    // GUARDAR CONSULTA
    // ==============================
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
            // ==========================================
            // EDITAR CONSULTA
            // ==========================================

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
            }

            // ==========================================
            // NUEVA CONSULTA
            // ==========================================

            else {
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

            // ==========================================
            // LIMPIAR Y RECARGAR
            // ==========================================

            limpiarFormulario();
            setMostrarFormulario(false);
            setConsultaEditando(null);

            await cargarDatos();

        } catch (error) {
            console.error("Error al guardar consulta:", error);
            alert("No se pudo conectar con el servidor");
        }
    }

    // ==============================
    // VOLVER
    // ==============================

    function volver() {
        navigate("/pacientes");
    }

    // ==============================
    // VISTA
    // ==============================

    return (
        <div className="historia-contenedor">

            {/* ENCABEZADO */}

            <div className="historia-header">
                <div>
                    <h1>🦷 Consultas odontológicas</h1>

                    {paciente && (
                        <h2>
                            {paciente.nombre} {paciente.apellido}
                        </h2>
                    )}
                </div>

                <button onClick={volver}>
                    ← Volver a pacientes
                </button>
            </div>

            {/* BOTÓN NUEVA CONSULTA */}

            {!mostrarFormulario && (
                <button onClick={nuevaConsulta}>
                    ➕ Nueva consulta
                </button>
            )}

            {/* FORMULARIO */}

            {mostrarFormulario && (
                <div className="historia-card">

                    <h2>
                        {consultaEditando
                            ? "✏️ Editar consulta"
                            : "➕ Nueva consulta"}
                    </h2>

                    <form onSubmit={guardarConsulta}>

                        <div>
                            <label>
                                <strong>Fecha de consulta:</strong>
                            </label>
                            <br />

                            <input
                                type="date"
                                value={fechaConsulta}
                                onChange={(e) => setFechaConsulta(e.target.value)}
                                required
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                <strong>Motivo de consulta:</strong>
                            </label>
                            <br />

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

                        <br />

                        <div>
                            <label>
                                <strong>Diagnóstico:</strong>
                            </label>
                            <br />

                            <textarea
                                value={diagnostico}
                                onChange={(e) =>
                                    setDiagnostico(e.target.value)
                                }
                                placeholder="Diagnóstico realizado"
                                rows="3"
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                <strong>Tratamiento:</strong>
                            </label>
                            <br />

                            <textarea
                                value={tratamiento}
                                onChange={(e) =>
                                    setTratamiento(e.target.value)
                                }
                                placeholder="Tratamiento indicado o realizado"
                                rows="3"
                            />
                        </div>

                        <br />

                        <div>
                            <label>
                                <strong>Observaciones:</strong>
                            </label>
                            <br />

                            <textarea
                                value={observaciones}
                                onChange={(e) =>
                                    setObservaciones(e.target.value)
                                }
                                placeholder="Observaciones adicionales"
                                rows="3"
                            />
                        </div>

                        <br />

                        <button type="submit">
                            {consultaEditando
                                ? "💾 Actualizar consulta"
                                : "💾 Guardar consulta"}
                        </button>

                        {" "}

                        <button
                            type="button"
                            onClick={cancelarFormulario}
                        >
                            Cancelar
                        </button>

                    </form>
                </div>
            )}

            {/* CARGANDO */}

            {cargando && <p>Cargando consultas...</p>}

            {/* ERROR */}

            {error && <p>{error}</p>}

            {/* SIN CONSULTAS */}

            {!cargando &&
                !error &&
                consultas.length === 0 &&
                !mostrarFormulario && (
                    <div className="historia-card">
                        <p>
                            Este paciente todavía no tiene consultas
                            registradas.
                        </p>
                    </div>
                )}

            {/* LISTADO DE CONSULTAS */}

            {!cargando &&
                !error &&
                consultas.length > 0 && (
                    <div>

                        <h2>Historial de consultas</h2>

                        {consultas.map((consulta) => (
                            <div
                                className="consulta-card"
                                key={consulta.id}
                            >
                                <h3>
                                    📅 Consulta del{" "}
                                    {new Date(consulta.fecha_consulta + "T00:00:00").toLocaleDateString(
                                        "es-AR"
                                    )}
                                </h3>

                                <div className="datos-grid">

                                    <div className="dato-medico">
                                        <strong>
                                            Motivo de consulta
                                        </strong>
                                        <p>
                                            {consulta.motivo_consulta}
                                        </p>
                                    </div>

                                    <div className="dato-medico">
                                        <strong>Diagnóstico</strong>
                                        <p>
                                            {consulta.diagnostico ||
                                                "No registrado"}
                                        </p>
                                    </div>

                                    <div className="dato-medico">
                                        <strong>Tratamiento</strong>
                                        <p>
                                            {consulta.tratamiento ||
                                                "No registrado"}
                                        </p>
                                    </div>

                                    <div className="dato-medico">
                                        <strong>Observaciones</strong>
                                        <p>
                                            {consulta.observaciones ||
                                                "No registradas"}
                                        </p>
                                    </div>
                                    <div className="acciones-consulta">
                                        <button
                                            className="boton-editar"
                                            onClick={() => editarConsulta(consulta)}
                                        >
                                            ✏️ Editar
                                        </button>

                                        <button
                                            className="boton-eliminar"
                                            onClick={() => eliminarConsulta(consulta)}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}

                    </div>
                )}

        </div>
    );
}

export default Consultas;