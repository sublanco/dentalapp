import { useState } from "react"

function Odontograma() {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("caries")

  const [piezas, setPiezas] = useState({})

  const dientesSuperiores = [
    18, 17, 16, 15, 14, 13, 12, 11,
    21, 22, 23, 24, 25, 26, 27, 28
  ]

  const dientesInferiores = [
    48, 47, 46, 45, 44, 43, 42, 41,
    31, 32, 33, 34, 35, 36, 37, 38
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

  const seleccionarCara = (numero, cara) => {
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
  }

  const renderCara = (numero, cara, clase) => {
    const estado = piezas[numero]?.[cara]

    return (
      <span
        className={`cara-diente ${clase}`}
        onClick={(e) => {
          e.stopPropagation()
          seleccionarCara(numero, cara)
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

      <div className="odontograma-menu">

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
          {dientesSuperiores.map(renderDiente)}
        </div>

        <div className="separador"></div>

        <div className="fila-dientes">
          {dientesInferiores.map(renderDiente)}
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
