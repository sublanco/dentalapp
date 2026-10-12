
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
                <h2>Cargando paciente...</h2>
            </div>
        );
    }

    if (error || !paciente) {
        return (
            <div className="paciente-panel-page">
                <h2>No se pudo cargar el paciente</h2>
                <p>{error || "El paciente no existe."}</p>
                <button onClick={() => navigate("/pacientes")}>
                    ← Volver a pacientes
                </button>
            </div>
        );
    }

    return (
        <div className="paciente-panel-page">
            <div className="pagina-encabezado">
                <div className="titulo-con-icono">
                    <span className="pagina-icono">👤</span>
                    <div>
                        <h1>Panel del paciente</h1>
                        <p>Información y gestión odontológica</p>
                    </div>
                </div>
            </div>

            <section className="paciente-panel-datos">
                <div className="paciente-panel-avatar">
                    {paciente.nombre?.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h2>
                        {paciente.nombre} {paciente.apellido}
                    </h2>
                    <p>
                        <strong>DNI:</strong> {paciente.dni || "No registrado"}
                    </p>
                    <p>
                        <strong>Teléfono:</strong>{" "}
                        {paciente.telefono || "No registrado"}
                    </p>
                    <p>
                        <strong>Obra social:</strong>{" "}
                        {paciente.obra_social || "No registrada"}
                    </p>

                    <p>
                        <strong>Número de afiliado:</strong>{" "}
                        {paciente.numero_afiliado || "No registrado"}
                    </p>

                </div>
            </section>

            <section className="paciente-panel-seccion">
                <h2>Gestión odontológica</h2>
                <p>Seleccioná la sección que querés consultar.</p>

                <div className="paciente-panel-tarjetas">
                    <button
                        className="paciente-panel-tarjeta historia"
                        onClick={() =>
                            navigate(`/historias-clinicas/${paciente.id}`)
                        }
                    >
                        <span className="panel-tarjeta-icono">📋</span>
                        <h3>Historia Clínica</h3>
                        <p>Consultá los antecedentes y datos médicos.</p>
                        <span>Ver historia clínica →</span>
                    </button>

                    <button
                        className="paciente-panel-tarjeta consultas"
                        onClick={() =>
                            navigate(`/pacientes/${paciente.id}/consultas`)
                        }
                    >
                        <span className="panel-tarjeta-icono">📅</span>
                        <h3>Consultas</h3>
                        <p>Registrá y consultá las visitas odontológicas.</p>
                        <span>Ver consultas →</span>
                    </button>

                    <button
                        className="paciente-panel-tarjeta odontograma"
                        onClick={() =>
                            navigate(`/pacientes/${paciente.id}/odontograma`)
                        }
                    >
                        <span className="panel-tarjeta-icono">🦷</span>
                        <h3>Odontograma</h3>
                        <p>Consultá el estado de las piezas dentales.</p>
                        <span>Ver odontograma →</span>
                    </button>
                </div>
            </section>

            <button
                className="btn-panel-volver"
                onClick={() => navigate("/pacientes")}
            >
                ← Volver a pacientes
            </button>
        </div>
    );
}

export default PacientePanel;
