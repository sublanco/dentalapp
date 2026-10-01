import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function Pacientes() {
  const navigate = useNavigate();

  // ==============================
  // ESTADOS
  // ==============================

  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  // Datos del paciente
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [obraSocial, setObraSocial] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // ==============================
  // CARGAR PACIENTES
  // ==============================

  useEffect(() => {
    obtenerPacientes();
  }, []);

  async function obtenerPacientes() {
    try {
      const respuesta = await fetch(
        "http://127.0.0.1:8000/api/pacientes"
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los pacientes");
      }

      const datos = await respuesta.json();
      setPacientes(datos);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
    }
  }

  // ==============================
  // BUSCAR PACIENTES
  // ==============================

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const texto = busqueda.toLowerCase().trim();

    const nombreCompleto =
      `${paciente.nombre || ""} ${paciente.apellido || ""}`.toLowerCase();

    const dniPaciente = String(paciente.dni || "");

    return (
      nombreCompleto.includes(texto) ||
      dniPaciente.includes(texto)
    );
  });

  // ==============================
  // LIMPIAR FORMULARIO
  // ==============================

  function limpiarFormulario() {
    setNombre("");
    setApellido("");
    setDni("");
    setTelefono("");
    setEmail("");
    setFechaNacimiento("");
    setObraSocial("");
    setObservaciones("");
    setPacienteEditando(null);
  }

  // ==============================
  // NUEVO PACIENTE
  // ==============================

  function nuevoPaciente() {
    limpiarFormulario();
    setPacienteSeleccionado(null);
    setMostrarFormulario(true);
  }

  // ==============================
  // CANCELAR FORMULARIO
  // ==============================

  function cancelarFormulario() {
    limpiarFormulario();
    setMostrarFormulario(false);
  }

  // ==============================
  // EDITAR PACIENTE
  // ==============================

  function editarPaciente(paciente) {
    setPacienteEditando(paciente);

    setNombre(paciente.nombre || "");
    setApellido(paciente.apellido || "");
    setDni(paciente.dni || "");
    setTelefono(paciente.telefono || "");
    setEmail(paciente.email || "");
    setFechaNacimiento(paciente.fecha_nacimiento || "");
    setObraSocial(paciente.obra_social || "");
    setObservaciones(paciente.observaciones || "");

    setMostrarFormulario(true);
  }

  // ==============================
  // VER FICHA DEL PACIENTE
  // ==============================

  function verFicha(paciente) {
    setPacienteSeleccionado(paciente);
    setMostrarFormulario(false);
  }

  // ==============================
  // VER HISTORIA CLÍNICA
  // ==============================

  function verHistoriaClinica(paciente) {
    navigate(`/historias-clinicas/${paciente.id}`);
  }

  // ==============================
  // VER CONSULTAS
  // ==============================

  function verConsultas(paciente) {
    navigate(`/pacientes/${paciente.id}/consultas`);
  }

  // ==============================
  // VER ODONTOGRAMA
  // ==============================

  const verOdontograma = (paciente) => {
    navigate(`/pacientes/${paciente.id}/odontograma`);
  };

  // ==============================
  // GUARDAR PACIENTE
  // ==============================

  async function guardarPaciente(e) {
    e.preventDefault();

    const datosPaciente = {
      nombre,
      apellido,
      dni,
      telefono,
      email,
      fecha_nacimiento: fechaNacimiento || null,
      obra_social: obraSocial,
      observaciones,
    };

    try {
      const url = pacienteEditando
        ? `http://127.0.0.1:8000/api/pacientes/${pacienteEditando.id}`
        : "http://127.0.0.1:8000/api/pacientes";

      const respuesta = await fetch(url, {
        method: pacienteEditando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(datosPaciente),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        console.error("Error del servidor:", datos);
        alert("No se pudo guardar el paciente");
        return;
      }

      alert(
        pacienteEditando
          ? "Paciente actualizado correctamente"
          : "Paciente guardado correctamente"
      );

      limpiarFormulario();
      setMostrarFormulario(false);
      setPacienteSeleccionado(null);

      await obtenerPacientes();
    } catch (error) {
      console.error("Error al guardar paciente:", error);
      alert("No se pudo conectar con el servidor");
    }
  }

  // ==============================
  // ELIMINAR PACIENTE
  // ==============================

  async function eliminarPaciente(id) {
    const confirmar = window.confirm(
      "¿Está seguro de que desea eliminar este paciente?"
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/pacientes/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        console.error("Error del servidor:", datos);
        alert("No se pudo eliminar el paciente");
        return;
      }

      if (pacienteSeleccionado?.id === id) {
        setPacienteSeleccionado(null);
      }

      alert("Paciente eliminado correctamente");

      await obtenerPacientes();
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      alert("No se pudo conectar con el servidor");
    }
  }

  // ==============================
  // VISTA
  // ==============================

  return (
    <div className="pacientes-page">

      {/* ENCABEZADO */}

      <div className="pagina-encabezado">

        <div>
          <div className="titulo-con-icono">
            <span className="pagina-icono">
              👥
            </span>

            <div>
              <h1>Pacientes</h1>

              <p>
                Gestión y seguimiento de pacientes
              </p>
            </div>
          </div>
        </div>

        {!mostrarFormulario && (
          <button
            className="btn-pacientes btn-nuevo"
            onClick={nuevoPaciente}
          >
            ＋ Nuevo paciente
          </button>
        )}

      </div>


      {/* FORMULARIO */}

      {mostrarFormulario && (

        <div className="pacientes-card formulario-paciente">

          <div className="card-titulo">

            <div>
              <h2>
                {pacienteEditando
                  ? "Editar paciente"
                  : "Nuevo paciente"}
              </h2>

              <p>
                Complete los datos del paciente
              </p>
            </div>

          </div>


          <form onSubmit={guardarPaciente}>

            <div className="form-grid">

              <div className="campo-formulario">
                <label>Nombre</label>

                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>


              <div className="campo-formulario">
                <label>Apellido</label>

                <input
                  type="text"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>


              <div className="campo-formulario">
                <label>DNI</label>

                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                />
              </div>


              <div className="campo-formulario">
                <label>Teléfono</label>

                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>


              <div className="campo-formulario">
                <label>Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>


              <div className="campo-formulario">
                <label>Fecha de nacimiento</label>

                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                />
              </div>


              <div className="campo-formulario">
                <label>Obra social</label>

                <input
                  type="text"
                  value={obraSocial}
                  onChange={(e) => setObraSocial(e.target.value)}
                  placeholder="Ingrese la obra social"
                />
              </div>


              <div className="campo-formulario campo-completo">
                <label>Observaciones</label>

                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Observaciones del paciente"
                  rows="4"
                />
              </div>

            </div>


            <div className="formulario-acciones">

              <button
                type="submit"
                className="btn-pacientes btn-guardar-paciente"
              >
                💾{" "}
                {pacienteEditando
                  ? "Actualizar paciente"
                  : "Guardar paciente"}
              </button>


              <button
                type="button"
                className="btn-pacientes btn-cancelar"
                onClick={cancelarFormulario}
              >
                Cancelar
              </button>

            </div>

          </form>

        </div>
      )}


      {/* FICHA DEL PACIENTE */}

      {pacienteSeleccionado && !mostrarFormulario && (

        <div className="pacientes-card ficha-paciente">

          <div className="ficha-encabezado">

            <div>
              <span className="ficha-icono">
                🪪
              </span>

              <div>
                <h2>Ficha del paciente</h2>

                <h3>
                  {pacienteSeleccionado.nombre}{" "}
                  {pacienteSeleccionado.apellido}
                </h3>
              </div>
            </div>

            <button
              className="btn-pacientes btn-cerrar"
              onClick={() => setPacienteSeleccionado(null)}
            >
              ✕ Cerrar
            </button>

          </div>


          <div className="ficha-datos">

            <div>
              <span>DNI</span>
              <strong>
                {pacienteSeleccionado.dni || "No registrado"}
              </strong>
            </div>

            <div>
              <span>Fecha de nacimiento</span>
              <strong>
                {pacienteSeleccionado.fecha_nacimiento ||
                  "No registrada"}
              </strong>
            </div>

            <div>
              <span>Teléfono</span>
              <strong>
                {pacienteSeleccionado.telefono ||
                  "No registrado"}
              </strong>
            </div>

            <div>
              <span>Email</span>
              <strong>
                {pacienteSeleccionado.email ||
                  "No registrado"}
              </strong>
            </div>

            <div>
              <span>Obra social</span>
              <strong>
                {pacienteSeleccionado.obra_social ||
                  "No registrada"}
              </strong>
            </div>

            <div className="ficha-observaciones">
              <span>Observaciones</span>
              <strong>
                {pacienteSeleccionado.observaciones ||
                  "Sin observaciones"}
              </strong>
            </div>

          </div>

        </div>
      )}


      {/* BUSCADOR */}

      <div className="pacientes-card buscador-card">

        <div className="buscador-titulo">
          <div>
            <h2>Buscar paciente</h2>

            <p>
              Buscá por nombre, apellido o DNI
            </p>
          </div>
        </div>

        <div className="buscador-input">

          <span>🔎</span>

          <input
            type="text"
            placeholder="Nombre, apellido o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda("")}
            >
              ✕
            </button>
          )}

        </div>

      </div>


      {/* LISTADO */}

      <div className="pacientes-card listado-card">

        <div className="listado-encabezado">

          <div>
            <h2>Listado de pacientes</h2>

            <p>
              {pacientesFiltrados.length} paciente
              {pacientesFiltrados.length !== 1 ? "s" : ""}
            </p>
          </div>

        </div>


        {pacientesFiltrados.length === 0 ? (

          <div className="sin-pacientes">

            <div>
              👥
            </div>

            <h3>
              No se encontraron pacientes
            </h3>

            <p>
              Probá con otro nombre, apellido o DNI.
            </p>

          </div>

        ) : (

          <div className="tabla-contenedor">

            <table className="tabla-pacientes">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Paciente</th>
                  <th>DNI</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>

              </thead>

              <tbody>

                {pacientesFiltrados.map((paciente) => (

                  <tr key={paciente.id}>

                    <td>
                      <span className="id-paciente">
                        #{paciente.id}
                      </span>
                    </td>

                    <td>

                      <div className="nombre-tabla">

                        <div className="avatar-paciente">
                          {paciente.nombre
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {paciente.nombre}{" "}
                            {paciente.apellido}
                          </strong>

                        </div>

                      </div>

                    </td>

                    <td>
                      {paciente.dni}
                    </td>

                    <td>
                      {paciente.telefono}
                    </td>

                    <td>

                      <div className="acciones-paciente">

                        <button
                          className="accion ficha"
                          onClick={() =>
                            verFicha(paciente)
                          }
                          title="Ver ficha"
                        >
                          🪪
                        </button>


                        <button
                          className="accion editar"
                          onClick={() =>
                            editarPaciente(paciente)
                          }
                          title="Editar paciente"
                        >
                          ✏️
                        </button>


                        <button
                          className="accion historia"
                          onClick={() =>
                            verHistoriaClinica(paciente)
                          }
                          title="Historia clínica"
                        >
                          📋
                        </button>


                        <button
                          className="accion consulta"
                          onClick={() =>
                            verConsultas(paciente)
                          }
                          title="Consultas"
                        >
                          📅
                        </button>


                        <button
                          className="accion odontograma"
                          onClick={() =>
                            verOdontograma(paciente)
                          }
                          title="Odontograma"
                        >
                          🦷
                        </button>


                        <button
                          className="accion eliminar"
                          onClick={() =>
                            eliminarPaciente(paciente.id)
                          }
                          title="Eliminar paciente"
                        >
                          🗑️
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Pacientes;

