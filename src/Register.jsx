import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import "./Auth.css"; // Reutilizando o CSS da tela de login

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      alert("Cadastro realizado com sucesso! Faça login.");
      navigate("/"); // 🔹 Redireciona para a tela de login
    } else {
      alert("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <form onSubmit={handleRegister}>
          <h2>Registrar</h2>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Registrar</button>
          <p>
            Já tem uma conta? <span onClick={() => navigate("/")}>Faça login</span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
