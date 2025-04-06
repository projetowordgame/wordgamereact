import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import "./StudentActivities.css";

const StudentActivities = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await fetch("http://localhost:3000/auth/teachers");
      const data = await response.json();
      setTeachers(data);
    };

    fetchTeachers();
  }, []);

  const handleTeacherChange = async (event) => {
    const teacherId = event.target.value;
    setSelectedTeacher(teacherId);
    
    if (teacherId) {
      const response = await fetch(`http://localhost:3000/quizzes/user/${teacherId}`);
      const data = await response.json();
      setQuizzes(data);
    } else {
      setQuizzes([]);
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

        <div className="quiz-list-student">
          {quizzes.length === 0 ? (
            <p>Nenhum quiz disponível para este professor.</p>
          ) : (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card-student" onClick={() => navigate(`/quizz/${quiz.id}`)}>
                <img src="/images/perguntas.png" alt="Quiz" className="quiz-image-student" />
                <h3>{quiz.title}</h3>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default StudentActivities;

