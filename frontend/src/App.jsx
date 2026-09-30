import { BrowserRouter, Routes, Route, Link } from "react-router";
import Pacientes from "./pages/pacientes";
import HistoriaClinica from "./pages/HistoriaClinica";
import Consultas from "./pages/Consultas";
import Odontograma from "./pages/Odontograma";
import CrearHistoriaClinica from "./pages/CrearHistoriaClinica";
import EditarHistoriaClinica from "./pages/EditarHistoriaClinica";

function Inicio() {
  return (
    <div>
      <h1>DentalApp 🦷</h1>
      <h2>Sistema de gestión odontológica</h2>

      <p>Bienvenido a DentalApp</p>

      <Link to="/pacientes">
        Ir a Pacientes
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Inicio</Link>
        {" | "}
        <Link to="/pacientes">Pacientes</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Inicio />} />

        <Route path="/pacientes" element={<Pacientes />} />

        <Route path="/historias-clinicas/:id" element={<HistoriaClinica />} />

        <Route path="/pacientes/:id/consultas" element={<Consultas />} />

        <Route path="/pacientes/:id/odontograma" element={<Odontograma />} />

        <Route path="/historias-clinicas/:id/crear" element={<CrearHistoriaClinica />} />

        <Route path="/historias-clinicas/:id/editar" element={<EditarHistoriaClinica />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;