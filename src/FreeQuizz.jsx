import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import "./MyActivities.css";

const FreeQuizz = () => {
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
      const userResponse = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = await userResponse.json();
      const userId = userData.id;

      // Obtém os quizzes livres(usuario admin)
      const quizResponse = await fetch(`${API_URL}/quizzes/freequizz`, {
        method: "GET"
      });

      const quizData = await quizResponse.json();
      setQuizzes(quizData);
    };

    fetchQuizzes();
  }, [navigate]);


  return (
    <>
      <Header />
      <div className="my-activities-container">
        <h2>Minhas Atividades</h2>
        <div className="quiz-list">
          {quizzes.length === 0 ? (
            <p>Você ainda não criou nenhum quiz.</p>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card" onClick={() => navigate(`/quizz/${quiz.id}`)}>
                <img src="/images/perguntas.png" alt="Quiz" className="quiz-image" />
                <h3>{quiz.title}</h3>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default FreeQuizz;
