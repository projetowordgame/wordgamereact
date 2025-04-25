import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import Swal from "sweetalert2";
import "./Auth.css"; // Reutilizando o CSS da tela de login

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("aluno");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Cadastro realizado!",
        text: "Agora você pode fazer login.",
        confirmButtonText: "Ok",
      }).then(() => navigate("/login"));
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro ao cadastrar",
        text: "Verifique os dados e tente novamente.",
        confirmButtonText: "Tentar novamente",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="auth-container">
        <form onSubmit={handleRegister} autoComplete="off">
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
          </select>

          <button type="submit">Registrar</button>
          <p>
            Já tem uma conta?{" "}
            <span onClick={() => navigate("/login")}>Faça login</span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
