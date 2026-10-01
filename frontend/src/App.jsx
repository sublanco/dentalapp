import { BrowserRouter, Routes, Route, Link } from "react-router";

import Pacientes from "./pages/pacientes";
import HistoriaClinica from "./pages/HistoriaClinica";
import Consultas from "./pages/Consultas";
import Odontograma from "./pages/Odontograma";
import CrearHistoriaClinica from "./pages/CrearHistoriaClinica";
import EditarHistoriaClinica from "./pages/EditarHistoriaClinica";


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

  return (
    <BrowserRouter>

      {/* MENÚ GENERAL */}

      <nav className="dental-navbar">

        <div className="dental-navbar-contenido">

          <Link
            to="/"
            className="dental-brand"
          >

            <span className="dental-brand-icon">
              🦷
            </span>

            <span>
              Doliani Dental
            </span>

          </Link>


          <div className="dental-links">

            <Link to="/">
              Inicio
            </Link>

            <Link to="/pacientes">
              Pacientes
            </Link>

          </div>

        </div>

      </nav>


      {/* CONTENIDO */}

      <main className="dental-main">

        <Routes>

          <Route
            path="/"
            element={<Inicio />}
          />

          <Route
            path="/pacientes"
            element={<Pacientes />}
          />

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

