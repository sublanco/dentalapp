import { BrowserRouter, Routes, Route, Link } from "react-router";

import Pacientes from "./pages/pacientes";
import HistoriaClinica from "./pages/HistoriaClinica";
import Consultas from "./pages/Consultas";
import Odontograma from "./pages/Odontograma";
import CrearHistoriaClinica from "./pages/CrearHistoriaClinica";
import EditarHistoriaClinica from "./pages/EditarHistoriaClinica";
import PacientePanel from "./pages/PacientePanel";
import { useEffect, useState } from "react";
import Login from "./pages/Login";


function Inicio() {
  return (
    <div className="inicio">

      {/* ENCABEZADO */}

      <div className="inicio-hero">

        <div className="logo-principal">
          🦷
        </div>

        <div>
          <h1>Doliani Dental</h1>

          <p>
            Sistema de gestión odontológica
          </p>

          <span className="nombre-profesional">
            Dra. Laura Doliani
          </span>
        </div>

      </div>


      <div className="inicio-bienvenida">

        <h2>
          Bienvenido a Doliani Dental
        </h2>

        <p>
          Gestioná pacientes, historias clínicas,
          consultas y odontogramas desde un solo lugar.
        </p>

      </div>


      {/* ACCESOS PRINCIPALES */}

      <div className="inicio-tarjetas">

        <Link
          to="/pacientes"
          className="inicio-tarjeta"
        >

          <div className="tarjeta-icono">
            👥
          </div>

          <h3>
            Pacientes
          </h3>

          <p>
            Consultar y administrar
            los pacientes registrados.
          </p>

          <span>
            Ver pacientes →
          </span>

        </Link>


        <div className="inicio-tarjeta tarjeta-informativa">

          <div className="tarjeta-icono">
            📋
          </div>

          <h3>
            Historias clínicas
          </h3>

          <p>
            Accedé a la historia clínica
            desde cada paciente.
          </p>

          <span>
            Disponible desde Pacientes
          </span>

        </div>


        <div className="inicio-tarjeta tarjeta-informativa">

          <div className="tarjeta-icono">
            📅
          </div>

          <h3>
            Consultas
          </h3>

          <p>
            Gestioná las consultas
            odontológicas de cada paciente.
          </p>

          <span>
            Disponible desde Pacientes
          </span>

        </div>


        <div className="inicio-tarjeta tarjeta-informativa">

          <div className="tarjeta-icono">
            🦷
          </div>

          <h3>
            Odontograma
          </h3>

          <p>
            Registrá el estado de cada
            pieza dental.
          </p>

          <span>
            Disponible desde Pacientes
          </span>

        </div>

      </div>


      {/* PIE */}

      <div className="inicio-footer">

        <span>
          🦷 Doliani Dental
        </span>

        <span>
          Dra. Laura Doliani
        </span>

      </div>

    </div>
  );
}


function App() {
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    async function comprobarSesion() {
      try {
        const respuesta = await fetch(
          "http://localhost:8000/api/user",
          {
            credentials: "include",
            headers: { Accept: "application/json" },
          }
        );

        if (respuesta.ok) {
          const datos = await respuesta.json();
          setUsuario(datos);
        }
      } catch (error) {
        console.error("Error al comprobar la sesión:", error);
      } finally {
        setVerificando(false);
      }
    }

    comprobarSesion();
  }, []);

  async function cerrarSesion() {
    try {
      const csrf = await fetch(
        "http://localhost:8000/sanctum/csrf-cookie",
        { credentials: "include" }
      );

      if (!csrf.ok) {
        throw new Error("No se pudo preparar el cierre de sesión.");
      }

      const token = decodeURIComponent(
        document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith("XSRF-TOKEN="))
          ?.split("=")[1] || ""
      );

      const respuesta = await fetch(
        "http://localhost:8000/api/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo cerrar sesión.");
      }

      setUsuario(null);
    } catch (error) {
      alert(error.message);
    }
  }

  if (verificando) {
    return <p style={{ textAlign: "center" }}>Verificando sesión...</p>;
  }

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  return (
    <BrowserRouter>
      <nav className="dental-navbar">
        <div className="dental-navbar-contenido">
          <Link to="/" className="dental-brand">
            <span className="dental-brand-icon">🦷</span>
            <span>Doliani Dental</span>
          </Link>

          <div className="dental-links">
            <Link to="/">Inicio</Link>
            <Link to="/pacientes">Pacientes</Link>
            <button
              type="button"
              onClick={cerrarSesion}
              style={{
                background: "transparent",
                color: "inherit",
                border: "1px solid currentColor",
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="dental-main">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/pacientes/:id" element={<PacientePanel />} />
          <Route
            path="/historias-clinicas/:id"
            element={<HistoriaClinica />}
          />
          <Route
            path="/pacientes/:id/consultas"
            element={<Consultas />}
          />
          <Route
            path="/pacientes/:id/odontograma"
            element={<Odontograma />}
          />
          <Route
            path="/historias-clinicas/:id/crear"
            element={<CrearHistoriaClinica />}
          />
          <Route
            path="/historias-clinicas/:id/editar"
            element={<EditarHistoriaClinica />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

