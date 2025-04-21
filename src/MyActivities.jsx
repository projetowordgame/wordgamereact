import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import { Trash2 } from "lucide-react"; // ✅ Ícone de lixeira
import "./MyActivities.css";

const MyActivities = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Obtém o usuário logado
      const userResponse = await fetch("http://localhost:3000/auth/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = await userResponse.json();
      const userId = userData.id;

      // Obtém os quizzes do usuário
      const quizResponse = await fetch(`http://localhost:3000/quizzes/user/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const quizData = await quizResponse.json();
      setQuizzes(quizData);
    };

    fetchQuizzes();
  }, [navigate]);

  // Função para deletar um quiz
  const deleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este quiz?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/quizzes/${quizId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Quiz excluído com sucesso!");
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId)); // Remove do estado
    } else {
      alert("Erro ao excluir quiz!");
    }
  };

  return (
    <>
      <Header />
      <div className="my-activities-container">
        <h2>Meus Jogos</h2>
        <div className="quiz-list">
          {quizzes.length === 0 ? (
            <p>Você ainda não criou nenhum quiz.</p>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card" onClick={() => navigate(`/quizz/${quiz.id}`)}>
                <img src="/images/perguntas.png" alt="Quiz" className="quiz-image" />
                <h3>{quiz.title}</h3>
                <Trash2 className="delete-icon" onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz.id); }} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyActivities;
