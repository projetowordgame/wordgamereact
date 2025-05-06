import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import  Header from "./components/header/header";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: "perguntas",
      name: "Jogo de Perguntas",
      description: "Crie quizzes interativos e teste seus conhecimentos.",
      image: "/images/perguntas.png",
      route: "/create-quizz"
    }
  ];


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // 🔹 Redireciona para a página de login se não estiver autenticado
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
      navigate("/login"); // 🔹 Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <h2>Escolha um jogo para criar</h2>
        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card" onClick={() => navigate(game.route)}>
              <img src={game.image} alt={game.name} />
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;

