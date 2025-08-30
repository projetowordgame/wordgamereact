import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import { Trash2 } from "lucide-react"; // ✅ Ícone de lixeira
import Swal from "sweetalert2";
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
      const userResponse = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = await userResponse.json();
      const userId = userData.id;

      // Obtém os quizzes do usuário
      const quizResponse = await fetch(`${API_URL}/quizzes/user/${userId}`, {
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
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Você realmente quer excluir este quiz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: 'swal-wide', // define uma largura maior
        confirmButton: 'swal-button',
        cancelButton: 'swal-button'
      }
    });
  
    if (!result.isConfirmed) return;
  
    const token = localStorage.getItem("token");
  
    const response = await fetch(`${API_URL}/quizzes/${quizId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (response.ok) {
      await Swal.fire({
        title: "Excluído!",
        text: "O quiz foi removido com sucesso.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button'
        }
      });
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    } else {
      await Swal.fire({
        title: "Erro!",
        text: "Houve um problema ao excluir o quiz.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button'
        }
      });
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
