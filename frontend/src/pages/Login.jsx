
import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      // Obtener la cookie de protección CSRF
      const csrf = await fetch(
        "http://localhost:8000/sanctum/csrf-cookie",
        { credentials: "include" }
      );

      if (!csrf.ok) {
        throw new Error("No se pudo iniciar la sesión.");
      }

      // Leer la cookie XSRF-TOKEN
      const token = decodeURIComponent(
        document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith("XSRF-TOKEN="))
          ?.split("=")[1] || ""
      );

      if (!token) {
        throw new Error("No se pudo obtener el token de seguridad.");
      }

      const respuesta = await fetch(
        "http://localhost:8000/api/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": token,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!respuesta.ok) {
        if (respuesta.status === 422) {
          throw new Error("Correo o contraseña incorrectos.");
        }
        throw new Error("No se pudo iniciar sesión.");
      }

      const datos = await respuesta.json();
      onLogin(datos.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "70px auto",
        padding: "35px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "50px" }}>🦷</div>

      <h1>Doliani Dental</h1>
      <p>Sistema de gestión odontológica</p>
      <p>Dra. Laura Doliani</p>

      <h2>Iniciar sesión</h2>

      <form onSubmit={iniciarSesion}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          style={{
            width: "100%",
            padding: "12px",
            background: "#168aad",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
