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
    <div>
      <h1>Pacientes 🦷</h1>
      <p>Gestión de pacientes</p>

      {/* BOTÓN NUEVO PACIENTE */}

      {!mostrarFormulario && (
        <button onClick={nuevoPaciente}>
          Nuevo paciente
        </button>
      )}

      {/* FORMULARIO DE PACIENTE */}

      {mostrarFormulario && (
        <div>
          <hr />

          <h2>
            {pacienteEditando
              ? "Editar paciente"
              : "Nuevo paciente"}
          </h2>

          <form onSubmit={guardarPaciente}>
            <div>
              <label>Nombre:</label>
              <br />
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <br />

            <div>
              <label>Apellido:</label>
              <br />
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>

            <br />

            <div>
              <label>DNI:</label>
              <br />
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </div>

            <br />

            <div>
              <label>Teléfono:</label>
              <br />
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>

            <br />

            <div>
              <label>Email:</label>
              <br />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <br />

            <div>
              <label>Fecha de nacimiento:</label>
              <br />
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </div>

            <br />

            <div>
              <label>Obra social:</label>
              <br />
              <input
                type="text"
                value={obraSocial}
                onChange={(e) => setObraSocial(e.target.value)}
                placeholder="Ingrese la obra social"
              />
            </div>

            <br />

            <div>
              <label>Observaciones:</label>
              <br />
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Observaciones del paciente"
                rows="4"
              />
            </div>

            <br />

            <button type="submit">
              {pacienteEditando
                ? "Actualizar paciente"
                : "Guardar paciente"}
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

      {/* FICHA DEL PACIENTE */}

      {pacienteSeleccionado && !mostrarFormulario && (
        <div>
          <hr />

          <h2>Ficha del paciente 🦷</h2>

          <h3>
            {pacienteSeleccionado.nombre}{" "}
            {pacienteSeleccionado.apellido}
          </h3>

          <p>
            <strong>DNI:</strong>{" "}
            {pacienteSeleccionado.dni || "No registrado"}
          </p>

          <p>
            <strong>Fecha de nacimiento:</strong>{" "}
            {pacienteSeleccionado.fecha_nacimiento || "No registrada"}
          </p>

          <p>
            <strong>Teléfono:</strong>{" "}
            {pacienteSeleccionado.telefono || "No registrado"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {pacienteSeleccionado.email || "No registrado"}
          </p>

          <p>
            <strong>Obra social:</strong>{" "}
            {pacienteSeleccionado.obra_social || "No registrada"}
          </p>

          <p>
            <strong>Observaciones:</strong>{" "}
            {pacienteSeleccionado.observaciones || "Sin observaciones"}
          </p>

          <button
            onClick={() => editarPaciente(pacienteSeleccionado)}
          >
            Editar paciente
          </button>

          {" "}

          <button
            onClick={() => verHistoriaClinica(pacienteSeleccionado)}
          >
            Ver Historia Clínica
          </button>

          {" "}

          <button
            onClick={() => setPacienteSeleccionado(null)}
          >
            Cerrar ficha
          </button>
        </div>
      )}

      {/* BUSCADOR */}

      <hr />

      <h2>Buscar paciente</h2>

      <input
        type="text"
        placeholder="Buscar por nombre, apellido o DNI..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: "300px",
          padding: "8px",
        }}
      />

      {/* LISTADO DE PACIENTES */}

      <h2>Listado de pacientes</h2>

      {pacientesFiltrados.length === 0 ? (
        <p>No se encontraron pacientes.</p>
      ) : (
        <table className="tabla-pacientes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pacientesFiltrados.map((paciente) => (
              <tr key={paciente.id}>
                <td>{paciente.id}</td>
                <td>{paciente.nombre}</td>
                <td>{paciente.apellido}</td>
                <td>{paciente.dni}</td>
                <td>{paciente.telefono}</td>

                <td>
                  <button
                    onClick={() => verFicha(paciente)}
                  >
                    Ver ficha
                  </button>

                  {" "}

                  <button
                    onClick={() => editarPaciente(paciente)}
                  >
                    Editar
                  </button>

                  {" "}

                  {/* BOTÓN HISTORIA CLÍNICA */}

                  <button
                    onClick={() => verHistoriaClinica(paciente)}
                  >
                    🦷 Historia clínica
                  </button>

                  {" "}

                  <button
                    onClick={() => eliminarPaciente(paciente.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Pacientes;