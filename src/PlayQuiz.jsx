import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PlayQuiz.css";
import Header from "./components/header/header";

const API_URL = import.meta.env.VITE_API_URL;

const PlayQuiz = () => {
  const { id } = useParams(); // ID do quiz na URL
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [quizDuration, setQuizDuration] = useState(0); // em segundos
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]); // Array com respostas detalhadas
  const [questionStartTime, setQuestionStartTime] = useState(null); // Tempo de início de cada pergunta
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await fetch(`${API_URL}/quizzes/${id}`);
      const data = await response.json();
      setQuiz(data);
      setStartTime(Date.now()); // Inicia contagem do tempo
      setQuestionStartTime(Date.now()); // Inicia tempo da primeira pergunta
    };

    fetchQuiz();
  }, [id]);

  const saveScore = async (correctAnswers, durationInSeconds) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false); // não logado
      return;
    }

    const profileResponse = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!profileResponse.ok) {
      setIsLoggedIn(false);
      return;
    }

    const user = await profileResponse.json();
    setIsLoggedIn(true); // logado

    // Envia score e tempo para o backend (endpoint existente)
    await fetch(`${API_URL}/quizzes/ranking/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        correctAnswers: correctAnswers,
        timeInSeconds: durationInSeconds,
      }),
    });

    // Envia respostas detalhadas para o novo endpoint
    await saveUserAnswers(user.id, durationInSeconds);

    // Busca ranking atualizado
    const rankingResponse = await fetch(`${API_URL}/quizzes/ranking/${id}`);
    const rankingData = await rankingResponse.json();
    setRanking(rankingData);
  };

  const saveUserAnswers = async (userId, durationInSeconds) => {
    try {
      // Calcula tempo aproximado por pergunta
      const timePerQuestion = Math.floor(durationInSeconds / quiz.questions.length);

      // Formata os dados conforme esperado pela API
      const formattedAnswers = userAnswers.map((answer) => ({
        questionId: answer.questionId,
        answerId: answer.answerId,
        isCorrect: answer.isCorrect,
        timeSpentInSeconds: answer.timeSpentInSeconds || timePerQuestion,
      }));

      // Envia para o novo endpoint
      const response = await fetch(`${API_URL}/quizzes/${id}/user-answers/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAnswers: formattedAnswers,
        }),
      });

      if (!response.ok) {
        console.error("Erro ao salvar respostas detalhadas:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao enviar respostas detalhadas:", error);
    }
  };

  const handleAnswerClick = (answer) => {
    const isCorrect = answer.isCorrect;
    setSelectedAnswer(isCorrect ? "correct" : "wrong");

    // Calcula tempo gasto nesta pergunta
    const timeSpentInSeconds = Math.floor((Date.now() - questionStartTime) / 1000);

    // Adiciona a resposta ao array com informações detalhadas
    const newAnswer = {
      questionId: quiz.questions[currentQuestion].id,
      answerId: answer.id,
      isCorrect: isCorrect,
      timeSpentInSeconds: timeSpentInSeconds,
    };

    setUserAnswers((prev) => [...prev, newAnswer]);

    setTimeout(async () => {
      setSelectedAnswer(null);
      if (isCorrect) {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
      }

      if (currentQuestion + 1 < quiz.questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setQuestionStartTime(Date.now()); // Reinicia o tempo para a próxima pergunta
      } else {
        const endTime = Date.now();
        const durationInSeconds = Math.floor((endTime - startTime) / 1000);
        setQuizDuration(durationInSeconds);
        await saveScore(isCorrect ? score.correct + 1 : score.correct, durationInSeconds);
        setIsFinished(true);
      }
    }, 1000);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore({ correct: 0, wrong: 0 });
    setIsFinished(false);
    setRanking([]);
    setUserAnswers([]); // Limpa respostas anteriores
    setStartTime(Date.now()); // reinicia cronômetro
    setQuestionStartTime(Date.now()); // reinicia tempo da pergunta
  };

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
        {!isFinished ? (
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
                  onClick={() => handleAnswerClick(answer)}
                >
                  {answer.text}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="results">
            <h2>Fim do Quiz!</h2>
            <p>✅ Respostas Corretas: {score.correct}</p>
            <p>❌ Respostas Erradas: {score.wrong}</p>
            <p>⏱️ Tempo Total: {formatTime(quizDuration)}</p>
            <button className="button-again" onClick={restartGame}>🔄 Jogar Novamente</button>

            {/* 🏆 Ranking */}
            <div className="ranking">
              <h3>🏆 Ranking</h3>
              {!isLoggedIn && (
                <p style={{ color: "#b00", fontWeight: "bold" }}>
                  🔐 Faça login para participar do ranking!
                </p>
              )}
              {ranking.length === 0 ? (
                <p>Nenhum jogador ainda.</p>
              ) : (
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th>Posição</th>
                      <th>Usuário</th>
                      <th>Acertos</th>
                      <th>Tempo (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.map((entry, index) => (
                      <tr key={index}>
                        <td>{index + 1}º</td>
                        <td>{entry.username}</td>
                        <td>{entry.correctanswers}</td>
                        <td>{formatTime(entry.timeinseconds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlayQuiz;
