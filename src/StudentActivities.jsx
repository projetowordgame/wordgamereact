import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import "./StudentActivities.css";

const API_URL = import.meta.env.VITE_API_URL;

const StudentActivities = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [sequenceGames, setSequenceGames] = useState([]);
  const [hangmanGames, setHangmanGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await fetch(`${API_URL}/auth/teachers`);
      const data = await response.json();
      setTeachers(data);
    };

    fetchTeachers();
  }, []);

  const handleTeacherChange = async (event) => {
    const teacherId = event.target.value;
    setSelectedTeacher(teacherId);

    if (teacherId) {
      // buscar quizzes
      const quizzesRes = await fetch(`${API_URL}/quizzes/user/${teacherId}`);
      const quizzesData = await quizzesRes.json();
      setQuizzes(quizzesData);

      // buscar jogos da sequência
      const seqRes = await fetch(`${API_URL}/sequence-games/user/${teacherId}`);
      const seqData = await seqRes.json();
      setSequenceGames(seqData);

      // buscar jogos da forca
      const hangRes = await fetch(`${API_URL}/gallow/user/${teacherId}`);
      const hangData = await hangRes.json();
      setHangmanGames(hangData);
    } else {
      setQuizzes([]);
      setSequenceGames([]);
      setHangmanGames([]);
    }
  };

  return (
    <>
      <Header />
      <div className="teacher-quizzes-container">
        <h2>Selecione um Professor</h2>
        <select value={selectedTeacher} onChange={handleTeacherChange}>
          <option value="">Selecione um professor</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
          ))}
        </select>

        {/* --- Seção Quizzes --- */}
        <h2>Quizzes</h2>
        <div className="quiz-list-student">
          {quizzes.length === 0 ? (
            <p>Nenhum quiz disponível.</p>
          ) : (
            quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="quiz-card-student"
                onClick={() => navigate(`/quizz/${quiz.id}`)}
              >
                <img src="/images/perguntas.png" alt="Quiz" className="quiz-image-student" />
                <h3>{quiz.title}</h3>
              </div>
            ))
          )}
        </div>

        <hr />

        {/* --- Seção Jogo da Sequência --- */}
        <h2>Jogos de Sequência</h2>
        <div className="quiz-list-student">
          {sequenceGames.length === 0 ? (
            <p>Nenhum jogo de sequência disponível.</p>
          ) : (
            sequenceGames.map((game) => (
              <div
                key={game.id}
                className="quiz-card-student"
                onClick={() => navigate(`/sequence-games/${game.id}`)}
              >
                <img src="/images/sequencia.png" alt="Sequência" className="quiz-image-student" />
                <h3>{game.title}</h3>
              </div>
            ))
          )}
        </div>

        <hr />

        {/* --- Seção Forca --- */}
        <h2>Jogos da Forca</h2>
        <div className="quiz-list-student">
          {hangmanGames.length === 0 ? (
            <p>Nenhum jogo de forca disponível.</p>
          ) : (
            hangmanGames.map((game) => (
              <div
                key={game.id}
                className="quiz-card-student"
                onClick={() => navigate(`/gallow/${game.id}`)}
              >
                <img src="/images/forca.png" alt="Forca" className="quiz-image-student" />
                <h3>{game.title}</h3>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default StudentActivities;

