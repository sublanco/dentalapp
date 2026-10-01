import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function HistoriaClinica() {
const { id } = useParams();
const navigate = useNavigate();

const [historia, setHistoria] = useState(null);
const [cargando, setCargando] = useState(true);
const [noExiste, setNoExiste] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
obtenerHistoria();
}, [id]);

async function obtenerHistoria() {
try {
setCargando(true);
setError("");
setNoExiste(false);


  console.log("ID DEL PACIENTE EN HISTORIA CLÍNICA:", id);

  const respuesta = await fetch(
    `http://127.0.0.1:8000/api/historias-clinicas/${id}`
  );

  if (respuesta.status === 404) {
    setNoExiste(true);
    return;
  }

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener la historia clínica");
  }

  const datos = await respuesta.json();

  setHistoria(datos);
} catch (error) {
  console.error(error);
  setError("No se pudo cargar la historia clínica");
} finally {
  setCargando(false);
}


}

function mostrarSiNo(valor) {
return valor === 1 || valor === true ? "Sí" : "No";
}

if (cargando) {
return ( <div className="historia-page"> <div className="historia-cargando"> <div className="historia-cargando-icono">🦷</div> <h2>Historia Clínica</h2> <p>Cargando información...</p> </div> </div>
);
}

if (noExiste) {
return ( <div className="historia-page">


    <div className="pagina-encabezado">
      <div className="titulo-con-icono">
        <div className="pagina-icono">📋</div>

        <div>
          <h1>Historia Clínica</h1>
          <p>Información clínica del paciente</p>
        </div>
      </div>
    </div>

    <div className="historia-vacia">

      <div className="historia-vacia-icono">
        📋
      </div>

      <h2>
        Este paciente todavía no tiene historia clínica
      </h2>

      <p>
        Podés crear la historia clínica para este paciente
        desde aquí.
      </p>

      <div className="historia-acciones">

        <button
          className="btn-historia btn-crear-historia"
          onClick={() =>
            navigate(`/historias-clinicas/${id}/crear`)
          }
        >
          ➕ Crear historia clínica
        </button>

        <button
          className="btn-historia btn-volver-historia"
          onClick={() => navigate("/pacientes")}
        >
          ← Volver a pacientes
        </button>

      </div>

    </div>

  </div>
);


}

if (error) {
return ( <div className="historia-page">


    <div className="pagina-encabezado">
      <div className="titulo-con-icono">
        <div className="pagina-icono">📋</div>

        <div>
          <h1>Historia Clínica</h1>
          <p>Información clínica del paciente</p>
        </div>
      </div>
    </div>

    <div className="historia-error">
      <div className="historia-error-icono">⚠️</div>

      <h2>Ocurrió un problema</h2>

      <p>{error}</p>

      <button
        className="btn-historia btn-volver-historia"
        onClick={() => navigate("/pacientes")}
      >
        ← Volver a pacientes
      </button>
    </div>

  </div>
);


}

if (!historia) {
return null;
}

return ( <div className="historia-page">

```
  {/* ENCABEZADO */}

  <div className="pagina-encabezado">

    <div className="titulo-con-icono">

      <div className="pagina-icono">
        📋
      </div>

      <div>
        <h1>Historia Clínica</h1>

        <p>
          Información clínica del paciente
        </p>
      </div>

    </div>

  </div>


  {/* DATOS DEL PACIENTE */}

  <section className="historia-card paciente-historia-card">

    <div className="historia-card-titulo">

      <div className="historia-seccion-icono">
        👤
      </div>

      <div>
        <h2>Datos del paciente</h2>
        <span>Información personal</span>
      </div>

    </div>


    {historia.paciente && (

      <div className="historia-datos-grid">

        <div className="dato-historia">
          <span>Nombre completo</span>

          <strong>
            {historia.paciente.nombre}{" "}
            {historia.paciente.apellido}
          </strong>
        </div>

        <div className="dato-historia">
          <span>DNI</span>

          <strong>
            {historia.paciente.dni}
          </strong>
        </div>

        <div className="dato-historia">
          <span>Teléfono</span>

          <strong>
            {historia.paciente.telefono || "No informado"}
          </strong>
        </div>

        <div className="dato-historia">
          <span>Email</span>

          <strong>
            {historia.paciente.email || "No informado"}
          </strong>
        </div>

      </div>

    )}

  </section>


  {/* DATOS MÉDICOS */}

  <section className="historia-card">

    <div className="historia-card-titulo">

      <div className="historia-seccion-icono">
        🩺
      </div>

      <div>
        <h2>Datos médicos</h2>
        <span>Información del médico de cabecera</span>
      </div>

    </div>


    <div className="historia-lista">

      <div className="historia-dato">
        <span>Médico de cabecera</span>
        <strong>
          {historia.medico_cabecera || "No informado"}
        </strong>
      </div>

      <div className="historia-dato">
        <span>Teléfono del médico</span>
        <strong>
          {historia.telefono_medico || "No informado"}
        </strong>
      </div>

      <div className="historia-dato">
        <span>Servicio de urgencia</span>
        <strong>
          {mostrarSiNo(historia.servicio_urgencia)}
        </strong>
      </div>

      {historia.servicio_urgencia_cual && (
        <div className="historia-dato">
          <span>Cuál</span>
          <strong>
            {historia.servicio_urgencia_cual}
          </strong>
        </div>
      )}

    </div>

  </section>


  {/* ANTECEDENTES */}

  <section className="historia-card">

    <div className="historia-card-titulo">

      <div className="historia-seccion-icono">
        📝
      </div>

      <div>
        <h2>Antecedentes</h2>
        <span>Antecedentes médicos relevantes</span>
      </div>

    </div>


    <div className="historia-lista">

      <div className="historia-dato">
        <span>Hospitalización</span>
        <strong>
          {mostrarSiNo(historia.hospitalizacion)}
        </strong>
      </div>

      {historia.hospitalizacion_motivo && (
        <div className="historia-dato">
          <span>Motivo</span>
          <strong>
            {historia.hospitalizacion_motivo}
          </strong>
        </div>
      )}

      <div className="historia-dato">
        <span>Tratamiento médico</span>
        <strong>
          {mostrarSiNo(historia.tratamiento_medico)}
        </strong>
      </div>

      {historia.tratamiento_medico_cual && (
        <div className="historia-dato">
          <span>Cuál</span>
          <strong>
            {historia.tratamiento_medico_cual}
          </strong>
        </div>
      )}

      <div className="historia-dato">
        <span>Alergias a medicamentos</span>
        <strong>
          {mostrarSiNo(historia.alergias_medicamentos)}
        </strong>
      </div>

      {historia.alergias_cuales && (
        <div className="historia-dato">
          <span>Cuáles</span>
          <strong>
            {historia.alergias_cuales}
          </strong>
        </div>
      )}

      <div className="historia-dato">
        <span>Sangrado excesivo</span>
        <strong>
          {mostrarSiNo(historia.sangrado_excesivo)}
        </strong>
      </div>

    </div>

  </section>


  {/* AFECCIONES */}

  <section className="historia-card">

    <div className="historia-card-titulo">

      <div className="historia-seccion-icono">
        ❤️
      </div>

      <div>
        <h2>Afecciones</h2>
        <span>Enfermedades o condiciones informadas</span>
      </div>

    </div>

    <div className="historia-observacion">

      {Array.isArray(historia.afecciones)
        ? historia.afecciones.join(", ")
        : historia.afecciones || "Ninguna"}

    </div>

  </section>


  {/* MEDICAMENTOS */}

  <section className="historia-card">

    <div className="historia-card-titulo">

      <div className="historia-seccion-icono">
        💊
      </div>

      <div>
        <h2>Medicamentos</h2>
        <span>Medicaciones actuales</span>
      </div>

    </div>


    <div className="historia-lista">

      <div className="historia-dato">
        <span>Toma medicamentos</span>
        <strong>
          {mostrarSiNo(historia.toma_medicamentos)}
        </strong>
      </div>

      {historia.medicamentos_cuales && (
        <div className="historia-dato">
          <span>Cuáles</span>
          <strong>
            {historia.medicamentos_cuales}
          </strong>
        </div>
      )}

    </div>

  </section>


  {/* HÁBITOS */}

  <section className="historia-card">

    <div className="historia-card-titulo">

      <div className="historia-seccion-icono">
        🌿
      </div>

      <div>
        <h2>Hábitos</h2>
        <span>Información sobre hábitos</span>
      </div>

    </div>


    <div className="historia-lista">

      <div className="historia-dato">
        <span>Cansancio al caminar</span>
        <strong>
          {mostrarSiNo(historia.cansancio_al_caminar)}
        </strong>
      </div>

      <div className="historia-dato">
        <span>Fuma</span>
        <strong>
          {mostrarSiNo(historia.fuma)}
        </strong>
      </div>

      {historia.cantidad_tabaco && (
        <div className="historia-dato">
          <span>Cantidad de tabaco</span>
          <strong>
            {historia.cantidad_tabaco}
          </strong>
        </div>
      )}

      <div className="historia-dato">
        <span>Bebe alcohol</span>
        <strong>
          {mostrarSiNo(historia.bebe_alcohol)}
        </strong>
      </div>

      {historia.cantidad_alcohol && (
        <div className="historia-dato">
          <span>Cantidad de alcohol</span>
          <strong>
            {historia.cantidad_alcohol}
          </strong>
        </div>
      )}

    </div>

  </section>


  {/* EMBARAZO */}

  <section className="historia-card">

    <div className="historia-card-titulo">

      <div className="historia-seccion-icono">
        🤰
      </div>

      <div>
        <h2>Embarazo</h2>
        <span>Información relacionada</span>
      </div>

    </div>


    <div className="historia-lista">

      <div className="historia-dato">
        <span>Embarazo</span>
        <strong>
          {mostrarSiNo(historia.embarazo)}
        </strong>
      </div>

      {historia.embarazo_tiempo && (
        <div className="historia-dato">
          <span>Tiempo</span>
          <strong>
            {historia.embarazo_tiempo}
          </strong>
        </div>
      )}

    </div>

  </section>


  {/* RADIACIÓN */}

  <section className="historia-card">

    <div className="historia-card-titulo">

      <div className="historia-seccion-icono">
        ☢️
      </div>

      <div>
        <h2>Radiación</h2>
        <span>Antecedentes de exposición</span>
      </div>

    </div>


    <div className="historia-lista">

      <div className="historia-dato">
        <span>Radiación</span>
        <strong>
          {mostrarSiNo(historia.radiacion)}
        </strong>
      </div>

    </div>

  </section>


  {/* INFORME MÉDICO */}

  <section className="historia-card">

    <div className="historia-card-titulo">

      <div className="historia-seccion-icono">
        📄
      </div>

      <div>
        <h2>Informe médico</h2>
        <span>Información adicional</span>
      </div>

    </div>


    <div className="historia-lista">

      <div className="historia-dato">
        <span>Informe médico</span>
        <strong>
          {mostrarSiNo(historia.informe_medico)}
        </strong>
      </div>

    </div>


    <div className="historia-observaciones">

      <span>Observaciones</span>

      <p>
        {historia.observaciones || "Sin observaciones"}
      </p>

    </div>

  </section>


  {/* ACCIONES */}

  <div className="historia-acciones-finales">

    <button
      className="btn-historia btn-editar-historia"
      onClick={() =>
        navigate(`/historias-clinicas/${id}/editar`)
      }
    >
      ✏️ Editar historia clínica
    </button>

    <button
      className="btn-historia btn-volver-historia"
      onClick={() => navigate("/pacientes")}
    >
      ← Volver a pacientes
    </button>

  </div>

</div>


);
}

export default HistoriaClinica;
