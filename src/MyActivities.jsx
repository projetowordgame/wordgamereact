import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import { Trash2 } from "lucide-react"; 
import Swal from "sweetalert2";
import "./MyActivities.css";

const API_URL = import.meta.env.VITE_API_URL;

const MyActivities = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [sequenceGames, setSequenceGames] = useState([]);
  const [hangmanGames, setHangmanGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // 🔑 Pega usuário logado
      const userResponse = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = await userResponse.json();
      const userId = userData.id;

      // 🔹 Quizzes
      const quizResponse = await fetch(`${API_URL}/quizzes/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(await quizResponse.json());

      // 🔹 Jogos da Sequência
      const seqResponse = await fetch(`${API_URL}/sequence-games/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSequenceGames(await seqResponse.json());

      // 🔹 Jogos da Forca
      // const hangResponse = await fetch(`${API_URL}/hangman-games/user/${userId}`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // setHangmanGames(await hangResponse.json());
    };

    fetchGames();
  }, [navigate]);

  // Função genérica de delete
  const deleteGame = async (id, type) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Você realmente quer excluir este jogo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${type}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      Swal.fire("Excluído!", "O jogo foi removido com sucesso.", "success");

      if (type === "quizzes") setQuizzes(quizzes.filter((q) => q.id !== id));
      if (type === "sequence-games") setSequenceGames(sequenceGames.filter((g) => g.id !== id));
      // if (type === "hangman-games") setHangmanGames(hangmanGames.filter((g) => g.id !== id));
    } else {
      Swal.fire("Erro!", "Não foi possível excluir o jogo.", "error");
    }
  };

  return (
    <>
      <Header />
      <div className="my-activities-container">
        <h2>Meus Jogos</h2>

        {/* --- Quizzes --- */}
        <h3>Quizzes</h3>
        <div className="quiz-list">
          {quizzes.length === 0 ? (
            <p>Nenhum quiz criado.</p>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card" onClick={() => navigate(`/quizz/${quiz.id}`)}>
                <img src="/images/perguntas.png" alt="Quiz" className="quiz-image" />
                <h3>{quiz.title}</h3>
                <Trash2
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGame(quiz.id, "quizzes");
                  }}
                />
              </div>
            ))
          )}
        </div>

        <hr />

        {/* --- Jogos de Sequência --- */}
        <h3>Jogos da Sequência</h3>
        <div className="quiz-list">
          {sequenceGames.length === 0 ? (
            <p>Nenhum jogo de sequência criado.</p>
          ) : (
            sequenceGames.map((game) => (
              <div
                key={game.id}
                className="quiz-card"
                onClick={() => navigate(`/sequence-games/${game.id}`)}
              >
                <img src="/images/sequencia.jpg" alt="Sequência" className="quiz-image" />
                <h3>{game.title}</h3>
                <Trash2
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGame(game.id, "sequence-games");
                  }}
                />
              </div>
            ))
          )}
        </div>

        <hr />

        {/* --- Jogos da Forca --- */}
        {/* <h3>Jogos da Forca</h3>
        <div className="quiz-list">
          {hangmanGames.length === 0 ? (
            <p>Nenhum jogo da forca criado.</p>
          ) : (
            hangmanGames.map((game) => (
              <div
                key={game.id}
                className="quiz-card"
                onClick={() => navigate(`/hangman/${game.id}`)}
              >
                <img src="/images/forca.png" alt="Forca" className="quiz-image" />
                <h3>{game.title}</h3>
                <Trash2
                  className="delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGame(game.id, "hangman-games");
                  }}
                />
              </div>
            ))
          )}
        </div> */}
      </div>
    </>
  );
};

export default MyActivities;
