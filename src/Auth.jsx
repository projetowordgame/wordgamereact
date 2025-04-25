import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import "./Auth.css";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔹 Impede acesso ao login se já estiver autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home"); // Redireciona para outra página
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      navigate("/free-activities"); // 🔹 Redireciona após login bem-sucedido
    } else {
      alert("Login falhou! Verifique suas credenciais.");
    }
  };

  return (
    <> {/* Adicionamos um fragmento para evitar o erro */}
      <Header />
      <div className="auth-container">
        <form onSubmit={handleLogin}>
        <img
  src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
  alt="Logo do Wordgame"
  className="auth-logo"
/>
        <h2>Faça seu login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Entrar</button>
          <p>
            Ainda não tem uma conta? <span onClick={() => navigate("/registrar")}>Criar uma conta</span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Auth;

