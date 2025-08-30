import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react"; // ✅ Ícone de lixeira
import Swal from "sweetalert2";
import Header from "./components/header/header";
import "./CreateQuizz.css";

const CreateQuizz = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setUser(data);
    };

    fetchUserData();
  }, [navigate]);

  // ✅ Adicionar uma nova pergunta (máximo de 10)
  const addQuestion = () => {
    if (questions.length < 10) {
      setQuestions([...questions, { text: "", answers: [{ text: "", isCorrect: false }] }]);
    } else {
      Swal.fire({
        icon: "info",
        title: "Limite atingido",
        text: "O quiz pode ter no máximo 10 perguntas.",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button'
        }
      });
    }
  };

  // ✅ Excluir uma pergunta
  const deleteQuestion = (qIndex) => {
    setQuestions(questions.filter((_, index) => index !== qIndex));
  };

  // ✅ Adicionar uma nova resposta (máximo de 4 por pergunta)
  const addAnswer = (qIndex) => {
    if (questions[qIndex].answers.length < 4) {
      const newQuestions = [...questions];
      newQuestions[qIndex].answers.push({ text: "", isCorrect: false });
      setQuestions(newQuestions);
    } else {
      Swal.fire({
        icon: "info",
        title: "Limite de respostas",
        text: "Cada pergunta pode ter no máximo 4 respostas.",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button'
        }
      });
    }
  };

  // ✅ Excluir uma resposta
  const deleteAnswer = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, index) => index !== aIndex);
    setQuestions(newQuestions);
  };

  // ✅ Atualizar pergunta
  const updateQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  // ✅ Atualizar resposta
  const updateAnswer = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex].text = value;
    setQuestions(newQuestions);
  };

  // ✅ Definir resposta correta (apenas uma por pergunta)
  const setCorrectAnswer = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.map((ans, i) => ({
      ...ans,
      isCorrect: i === aIndex,
    }));
    setQuestions(newQuestions);
  };

  // ✅ Enviar quiz para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Usuário não autenticado.",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button'
        }
      });
      return;
    }
  
    if (!title.trim() || questions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "O quiz precisa de um título e pelo menos uma pergunta.",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button'
        }
      });
      return;
    }
  
    const response = await fetch(`${API_URL}/quizzes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        title,
        questions,
      }),
    });
  
    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Quiz criado com sucesso!",
        confirmButtonText: "Ir para o painel",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button'
        }
      });
      navigate("/dashboard");
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Houve um erro ao criar o quiz.",
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
      <div className="create-quizz-container">
        <h2>Criar Novo Quiz</h2>
        <form onSubmit={handleSubmit}>
          <label>Título do Quiz:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <h3>Perguntas</h3>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="question-block">
              <div className="question-header">
                <input
                  type="text"
                  placeholder={`Pergunta ${qIndex + 1}`}
                  value={q.text}
                  onChange={(e) => updateQuestion(qIndex, e.target.value)}
                  required
                />
                <Trash2 className="delete-icon-quizz" onClick={() => deleteQuestion(qIndex)} /> {/* 🔴 Ícone de lixeira para excluir pergunta */}
              </div>

              <h4>Respostas:</h4>
              {q.answers.map((a, aIndex) => (
                <div key={aIndex} className="answer-block">
                  <input
                    type="text"
                    placeholder={`Resposta ${aIndex + 1}`}
                    value={a.text}
                    onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                    required
                  />
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={a.isCorrect}
                    onChange={() => setCorrectAnswer(qIndex, aIndex)}
                  />
                  <Trash2 className="delete-icon-quizz" onClick={() => deleteAnswer(qIndex, aIndex)} /> {/* 🔴 Ícone de lixeira para excluir resposta */}
                </div>
              ))}

              {q.answers.length < 4 && (
                <button className="button-pergunta" type="button" onClick={() => addAnswer(qIndex)}>
                  + Adicionar Resposta
                </button>
              )}
            </div>
          ))}

          <div className="button-row">
            {questions.length < 10 && (
              <button className="button-pergunta" type="button" onClick={addQuestion}>
                + Adicionar Pergunta
              </button>
            )}

            <button className="button-create" type="submit">Criar Quiz</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateQuizz;

