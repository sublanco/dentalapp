import { BrowserRouter, Routes, Route, Link } from "react-router";
import Pacientes from "./pages/pacientes";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;