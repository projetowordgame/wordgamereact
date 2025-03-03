import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // 🔹 Redireciona para a página de login se não estiver autenticado
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.removeItem("token"); // 🔹 Remove o token armazenado
      navigate("/"); // 🔹 Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  return (
    <div>
      <h1>Bem-vindo ao sistema de perguntas!</h1>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default Dashboard;

