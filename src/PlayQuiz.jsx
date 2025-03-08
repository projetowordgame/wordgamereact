import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PlayQuiz.css";
import Header from "./components/header/header";

const PlayQuiz = () => {
  const { id } = useParams(); // Obtém o ID do quiz da URL
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await fetch(`http://localhost:3000/quizzes/${id}`);
      const data = await response.json();
      setQuiz(data);
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerClick = (isCorrect) => {
    setSelectedAnswer(isCorrect ? "correct" : "wrong");
  
    setTimeout(() => {
      setSelectedAnswer(null);
      if (isCorrect) {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
      }
  
      if (currentQuestion + 1 < quiz.questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsFinished(true); // 🚀 Marca o quiz como finalizado
      }
    }, 1000);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore({ correct: 0, wrong: 0 });
    setIsFinished(false); // 🚀 Reseta o estado do jogo
  };

    // 🔹 Ajusta o carregamento da página:
if (!quiz) {
    return (
      <div className="play-quiz-container">
        <h2>Carregando Quiz...</h2>
      </div>
    );
  }

  return (
    <>
      <Header />
    <div className="play-quiz-container">
      {!isFinished ? ( // 🚀 Agora verifica se o quiz terminou
        <>
          <h2 className="question">{quiz.questions[currentQuestion].text}</h2>
          <div className="answers-container">
            {quiz.questions[currentQuestion].answers.map((answer, index) => (
              <div
                key={index}
                className={`answer-card ${
                  selectedAnswer === "correct" && answer.isCorrect
                    ? "correct"
                    : selectedAnswer === "wrong" && !answer.isCorrect
                    ? "wrong"
                    : ""
                }`}
                onClick={() => handleAnswerClick(answer.isCorrect)}
              >
                {answer.text}
              </div>
            ))}
          </div>
        </>
      ) : ( // 🚀 Exibe os resultados ao final
        <div className="results">
          <h2>Fim do Quiz!</h2>
          <p>✅ Respostas Corretas: {score.correct}</p>
          <p>❌ Respostas Erradas: {score.wrong}</p>
          <button onClick={restartGame}>🔄 Jogar Novamente</button>
        </div>
      )}
    </div>
    </>
  );
};

export default PlayQuiz;
