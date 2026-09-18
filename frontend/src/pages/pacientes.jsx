
import { useState, useEffect } from "react"

function Pacientes() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [pacienteEditando, setPacienteEditando] = useState(null)

  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [dni, setDni] = useState("")
  const [telefono, setTelefono] = useState("")
  const [email, setEmail] = useState("")

  const [pacientes, setPacientes] = useState([])

  useEffect(() => {
    obtenerPacientes()
  }, [])

  function obtenerPacientes() {
    fetch("http://127.0.0.1:8000/api/pacientes")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setPacientes(datos)
      })
      .catch((error) => {
        console.error("Error al obtener pacientes:", error)
      })
  }

  function limpiarFormulario() {
    setNombre("")
    setApellido("")
    setDni("")
    setTelefono("")
    setEmail("")
    setPacienteEditando(null)
  }

  function nuevoPaciente() {
    limpiarFormulario()
    setMostrarFormulario(true)
  }

  function cancelarFormulario() {
    limpiarFormulario()
    setMostrarFormulario(false)
  }

  function editarPaciente(paciente) {
    setPacienteEditando(paciente)

    setNombre(paciente.nombre || "")
    setApellido(paciente.apellido || "")
    setDni(paciente.dni || "")
    setTelefono(paciente.telefono || "")
    setEmail(paciente.email || "")

    setMostrarFormulario(true)
  }

  async function guardarPaciente(e) {
    e.preventDefault()

    try {
      let respuesta

      if (pacienteEditando) {
        // ACTUALIZAR PACIENTE
        respuesta = await fetch(
          `http://127.0.0.1:8000/api/pacientes/${pacienteEditando.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              nombre,
              apellido,
              dni,
              telefono,
              email,
            }),
          }
        )
      } else {
        // CREAR PACIENTE
        respuesta = await fetch(
          "http://127.0.0.1:8000/api/pacientes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              nombre,
              apellido,
              dni,
              telefono,
              email,
            }),
          }
        )
      }

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        console.error("Error del servidor:", datos)
        alert("No se pudo guardar el paciente")
        return
      }

      if (pacienteEditando) {
        alert("Paciente actualizado correctamente")
      } else {
        alert("Paciente guardado correctamente")
      }

      limpiarFormulario()
      setMostrarFormulario(false)

      obtenerPacientes()

    } catch (error) {
      console.error("Error:", error)
      alert("No se pudo conectar con el servidor")
    }
  }
  async function eliminarPaciente(id) {
  const confirmar = window.confirm(
    "¿Está seguro de que desea eliminar este paciente?"
  )

  if (!confirmar) {
    return
  }

  try {
    const respuesta = await fetch(
      `http://127.0.0.1:8000/api/pacientes/${id}`,
      {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
        },
      }
    )

    if (!respuesta.ok) {
      const datos = await respuesta.json()
      console.error("Error del servidor:", datos)
      alert("No se pudo eliminar el paciente")
      return
    }

    alert("Paciente eliminado correctamente")

    obtenerPacientes()

  } catch (error) {
    console.error("Error al eliminar paciente:", error)
    alert("No se pudo conectar con el servidor")
  }
}

  return (

    <div>
      <h1>Pacientes 🦷</h1>

      <p>Gestión de pacientes</p>

      {!mostrarFormulario && (
        <button onClick={nuevoPaciente}>
          Nuevo paciente
        </button>
      )}

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

      <hr />

      <h2>Listado de pacientes</h2>

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
          {pacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td>{paciente.id}</td>
              <td>{paciente.nombre}</td>
              <td>{paciente.apellido}</td>
              <td>{paciente.dni}</td>
              <td>{paciente.telefono}</td>

              <td>
                <button
                  onClick={() => editarPaciente(paciente)}
                >
                  Editar
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
    </div>
  )
}

export default Pacientes
