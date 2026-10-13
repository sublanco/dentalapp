import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function PacientePanel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [paciente, setPaciente] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function obtenerPaciente() {
            try {
                setCargando(true);
                setError("");

                const respuesta = await fetch(
                    `http://127.0.0.1:8000/api/pacientes/${id}`
                );

                if (!respuesta.ok) {
                    throw new Error("No se pudo obtener el paciente");
                }

                const datos = await respuesta.json();
                setPaciente(datos);
            } catch (err) {
                console.error("Error al obtener paciente:", err);
                setError("No se pudo cargar el paciente.");
            } finally {
                setCargando(false);
            }
        }

        obtenerPaciente();
    }, [id]);

    if (cargando) {
        return (
            <div className="paciente-panel-page">
                <div className="paciente-panel-mensaje">
                    <span>🦷</span>
                    <h2>Cargando paciente...</h2>
                </div>
            </div>
        );
    }

    if (error || !paciente) {
        return (
            <div className="paciente-panel-page">
                <div className="paciente-panel-mensaje">
                    <h2>No se pudo cargar el paciente</h2>
                    <p>{error || "El paciente no existe."}</p>
                    <button
                        className="btn-panel-volver"
                        onClick={() => navigate("/pacientes")}
                    >
                        ← Volver a pacientes
                    </button>
                </div>
            </div>
        );
    }

    const inicial = paciente.nombre?.charAt(0).toUpperCase() || "P";

    return (
        <div className="paciente-panel-page">
            <header className="pagina-encabezado">
                <div className="titulo-con-icono">
                    <span className="pagina-icono">👤</span>
                    <div>
                        <h1>Panel del paciente</h1>
                        <p>Información y gestión odontológica</p>
                    </div>
                </div>
            </header>

            {/* Identificación del paciente */}
            <section className="paciente-panel-datos">
                <div className="paciente-panel-avatar">
                    {inicial}
                </div>

                <div className="paciente-panel-identidad">
                    <span className="paciente-panel-etiqueta">
                        FICHA DEL PACIENTE
                    </span>

                    <h2>
                        {paciente.nombre} {paciente.apellido}
                    </h2>

                    <p className="paciente-panel-subtitulo">
                        Información personal y cobertura médica
                    </p>
                </div>
            </section>

            {/* Datos personales */}
            <section className="paciente-panel-bloque">
                <div className="paciente-panel-seccion-titulo">
                    <span className="paciente-panel-icono-seccion">📋</span>
                    <div>
                        <h2>Datos personales</h2>
                        <p>Información de identificación y contacto.</p>
                    </div>
                </div>

                <div className="paciente-panel-info-grid">
                    <div className="paciente-panel-info-item">
                        <span>DNI</span>
                        <strong>{paciente.dni || "No registrado"}</strong>
                    </div>

                    <div className="paciente-panel-info-item">
                        <span>Fecha de nacimiento</span>
                        <strong>
                            {paciente.fecha_nacimiento
                                ? new Date(
                                      `${paciente.fecha_nacimiento}T00:00:00`
                                  ).toLocaleDateString("es-AR")
                                : "No registrada"}
                        </strong>
                    </div>

                    <div className="paciente-panel-info-item">
                        <span>Teléfono</span>
                        <strong>
                            {paciente.telefono || "No registrado"}
                        </strong>
                    </div>

                    <div className="paciente-panel-info-item">
                        <span>Correo electrónico</span>
                        <strong className="paciente-panel-texto-largo">
                            {paciente.email || "No registrado"}
                        </strong>
                    </div>
                </div>
            </section>

            {/* Cobertura médica */}
            <section className="paciente-panel-cobertura">
                <div className="paciente-panel-seccion-titulo">
                    <span className="paciente-panel-icono-seccion">🏥</span>
                    <div>
                        <h2>Cobertura médica</h2>
                        <p>Datos de la obra social del paciente.</p>
                    </div>
                </div>

                <div className="paciente-panel-cobertura-grid">
                    <div className="paciente-panel-cobertura-item">
                        <span>Obra social</span>
                        <strong>
                            {paciente.obra_social || "No registrada"}
                        </strong>
                    </div>

                    <div className="paciente-panel-cobertura-item">
                        <span>Número de afiliado</span>
                        <strong>
                            {paciente.numero_afiliado || "No registrado"}
                        </strong>
                    </div>
                </div>
            </section>

            {/* Accesos a las funciones del sistema */}
            <section className="paciente-panel-seccion">
                <div className="paciente-panel-seccion-titulo">
                    <span className="paciente-panel-icono-seccion">🦷</span>
                    <div>
                        <h2>Gestión odontológica</h2>
                        <p>
                            Seleccioná la sección que querés consultar o
                            administrar.
                        </p>
                    </div>
                </div>

                <div className="paciente-panel-tarjetas">
                    <button
                        type="button"
                        className="paciente-panel-tarjeta historia"
                        onClick={() =>
                            navigate(`/historias-clinicas/${paciente.id}`)
                        }
                    >
                        <span className="panel-tarjeta-icono">📋</span>
                        <h3>Historia Clínica</h3>
                        <p>
                            Consultá los antecedentes y datos médicos del
                            paciente.
                        </p>
                        <span className="panel-tarjeta-enlace">
                            Ver historia clínica →
                        </span>
                    </button>

                    <button
                        type="button"
                        className="paciente-panel-tarjeta consultas"
                        onClick={() =>
                            navigate(`/pacientes/${paciente.id}/consultas`)
                        }
                    >
                        <span className="panel-tarjeta-icono">📅</span>
                        <h3>Consultas</h3>
                        <p>
                            Registrá y consultá las visitas odontológicas.
                        </p>
                        <span className="panel-tarjeta-enlace">
                            Ver consultas →
                        </span>
                    </button>

                    <button
                        type="button"
                        className="paciente-panel-tarjeta odontograma"
                        onClick={() =>
                            navigate(`/pacientes/${paciente.id}/odontograma`)
                        }
                    >
                        <span className="panel-tarjeta-icono">🦷</span>
                        <h3>Odontograma</h3>
                        <p>
                            Consultá y registrá el estado de las piezas
                            dentales.
                        </p>
                        <span className="panel-tarjeta-enlace">
                            Ver odontograma →
                        </span>
                    </button>
                </div>
            </section>

            <button
                type="button"
                className="btn-panel-volver"
                onClick={() => navigate("/pacientes")}
            >
                ← Volver a pacientes
            </button>
        </div>
    );
}

export default PacientePanel;