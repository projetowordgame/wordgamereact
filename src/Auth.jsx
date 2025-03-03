import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 🔹 Hook para navegação

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
      navigate("/dashboard"); // 🔹 Redireciona para o Dashboard
    } else {
      alert("Login falhou! Verifique suas credenciais.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
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
    </form>
  );
};

export default Auth;

