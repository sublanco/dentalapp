import { useState, useEffect } from "react"
import { useParams } from "react-router"


function Odontograma() {

  const { id } = useParams()
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("caries")
  const [tipoDenticion, setTipoDenticion] = useState("permanente")

  const [piezas, setPiezas] = useState({})
  const [paciente, setPaciente] = useState(null)

  useEffect(() => {
    const cargarOdontograma = async () => {
      try {
        const respuesta = await fetch(
          `http://127.0.0.1:8000/api/pacientes/${id}/odontograma`
        )

        if (!respuesta.ok) {
          throw new Error("No se pudo cargar el odontograma")
        }

        const datos = await respuesta.json()

        const piezasCargadas = {}

        datos.forEach((pieza) => {
          if (!piezasCargadas[pieza.numero_pieza]) {
            piezasCargadas[pieza.numero_pieza] = {}
          }

          piezasCargadas[pieza.numero_pieza][pieza.cara] = {
            id: pieza.id,
            estado: pieza.estado
          }
        })

        setPiezas(piezasCargadas)

        console.log(
          "Odontograma cargado:",
          piezasCargadas
        )

      } catch (error) {
        console.error(
          "Error al cargar odontograma:",
          error
        )
      }
    }

    cargarOdontograma()
  }, [id])
  useEffect(() => {
    const cargarPaciente = async () => {
      try {
        const respuesta = await fetch(
          `http://127.0.0.1:8000/api/pacientes/${id}`
        )

        if (!respuesta.ok) {
          throw new Error("No se pudo cargar el paciente")
        }

        const datos = await respuesta.json()

        setPaciente(datos)

        console.log("Paciente cargado:", datos)

      } catch (error) {
        console.error(
          "Error al cargar paciente:",
          error
        )
      }
    }

    cargarPaciente()
  }, [id])

  const dientesSuperiores = [
    18, 17, 16, 15, 14, 13, 12, 11,
    21, 22, 23, 24, 25, 26, 27, 28
  ]

  const dientesInferiores = [
    48, 47, 46, 45, 44, 43, 42, 41,
    31, 32, 33, 34, 35, 36, 37, 38
  ]
  const dientesTemporariosSuperiores = [
    55, 54, 53, 52, 51,
    61, 62, 63, 64, 65
  ]

  const dientesTemporariosInferiores = [
    85, 84, 83, 82, 81,
    71, 72, 73, 74, 75
  ]

  const estados = [
    {
      valor: "caries",
      nombre: "Caries"
    },
    {
      valor: "corona",
      nombre: "Corona"
    },
    {
      valor: "extraccion",
      nombre: "Extracción"
    },
    {
      valor: "ausente",
      nombre: "Ausente"
    },
    {
      valor: "obturacion",
      nombre: "Obturación"
    },
    {
      valor: "implante",
      nombre: "Implante"
    }
  ]

  const obtenerColor = (estado) => {
    if (estado === "caries") return "#ff6b6b"
    if (estado === "corona") return "#ffd166"
    if (estado === "extraccion") return "#6c757d"
    if (estado === "ausente") return "#212529"
    if (estado === "obturacion") return "#74c0fc"
    if (estado === "implante") return "#b197fc"

    return "white"
  }

  const seleccionarCara = async (numero, cara) => {
    console.log("Pieza:", numero)
    console.log("Cara:", cara)
    console.log("Estado:", estadoSeleccionado)

    setPiezas((previas) => ({
      ...previas,
      [numero]: {
        ...(previas[numero] || {}),
        [cara]: estadoSeleccionado
      }
    }))

    try {
      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/pacientes/${id}/odontograma`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            numero_pieza: String(numero),
            cara: cara,
            estado: estadoSeleccionado
          })
        }
      )

      if (!respuesta.ok) {
        throw new Error("No se pudo guardar la pieza")
      }

      const datos = await respuesta.json()

      console.log("Guardado correctamente:", datos)

    } catch (error) {
      console.error("Error al guardar odontograma:", error)
    }
  }
  const eliminarCara = async (numero, cara, piezaId) => {
    try {
      const respuesta = await fetch(
        `http://127.0.0.1:8000/api/odontograma-piezas/${piezaId}`,
        {
          method: "DELETE",
          headers: {
            "Accept": "application/json"
          }
        }
      )

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar la marca")
      }

      setPiezas((previas) => {
        const nuevasPiezas = { ...previas }

        if (nuevasPiezas[numero]) {
          const nuevasCaras = {
            ...nuevasPiezas[numero]
          }

          delete nuevasCaras[cara]

          if (Object.keys(nuevasCaras).length === 0) {
            delete nuevasPiezas[numero]
          } else {
            nuevasPiezas[numero] = nuevasCaras
          }
        }

        return nuevasPiezas
      })

      console.log("Marca eliminada correctamente")

    } catch (error) {
      console.error(
        "Error al eliminar marca:",
        error
      )
    }
  }


  const renderCara = (numero, cara, clase) => {
    const estado = piezas[numero]?.[cara]?.estado

    return (
      <span
        className={`cara-diente ${clase}`}

        onClick={(e) => {
          e.stopPropagation()
          seleccionarCara(numero, cara)
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()

          if (piezas[numero]?.[cara]) {
            eliminarCara(
              numero,
              cara,
              piezas[numero][cara].id
            )
          }
        }}

        style={{
          backgroundColor: estado
            ? obtenerColor(estado)
            : "white"
        }}
      >
        {cara === "central" ? numero : ""}
      </span>
    )
  }

  const renderDiente = (numero) => {
    return (
      <div
        key={numero}
        className="diente"
        title={`Pieza ${numero}`}
      >

        {renderCara(
          numero,
          "superior",
          "arriba"
        )}

        <div className="fila-central">

          {renderCara(
            numero,
            "izquierda",
            "izquierda"
          )}

          {renderCara(
            numero,
            "central",
            "centro"
          )}

          {renderCara(
            numero,
            "derecha",
            "derecha"
          )}

        </div>

        {renderCara(
          numero,
          "inferior",
          "abajo"
        )}

      </div>
    )
  }

  return (
    <div className="odontograma-container">

      <h2>Odontograma</h2>

      {paciente && (
        <div className="datos-paciente-odontograma">
          <strong>Paciente:</strong>{" "}
          {paciente.nombre} {paciente.apellido}
          {" | "}
          <strong>DNI:</strong>{" "}
          {paciente.dni}
        </div>
      )}

      <div className="odontograma-menu">
        <label htmlFor="denticion">
          Tipo de dentición:
        </label>

        <select
          id="denticion"
          value={tipoDenticion}
          onChange={(e) => setTipoDenticion(e.target.value)}
        >
          <option value="permanente">Permanente</option>
          <option value="temporaria">Temporaria (niños)</option>
        </select>

        <label htmlFor="estado">
          Seleccionar estado:
        </label>

        <select
          id="estado"
          value={estadoSeleccionado}
          onChange={(e) =>
            setEstadoSeleccionado(e.target.value)
          }
        >
          {estados.map((estado) => (
            <option
              key={estado.valor}
              value={estado.valor}
            >
              {estado.nombre}
            </option>
          ))}
        </select>

      </div>

      <div className="odontograma">

        <div className="fila-dientes">
          {(tipoDenticion === "permanente"
            ? dientesSuperiores
            : dientesTemporariosSuperiores
          ).map(renderDiente)}
        </div>

        <div className="separador"></div>

        <div className="fila-dientes">
          {(tipoDenticion === "permanente"
            ? dientesInferiores
            : dientesTemporariosInferiores
          ).map(renderDiente)}
        </div>

      </div>
      <div className="leyenda">

        <h3>Estados</h3>

        <div className="leyenda-items">

          {estados.map((estado) => (
            <div
              key={estado.valor}
              className="leyenda-item"
            >

              <span
                className={`leyenda-color ${estado.valor}`}
              ></span>

              {estado.nombre}

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}

export default Odontograma
