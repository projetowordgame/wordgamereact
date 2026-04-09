import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Header from "./components/header/header";
import "./CreateQuizz.css";

const API_URL = import.meta.env.VITE_API_URL;

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

  const showInstructions = () => {
    Swal.fire({
      title: "📘 Instruções para criar seu Quiz",
      html: `
        <div style="text-align: left; font-size: 16px; line-height: 1.6;">
          <p><b>1.</b> O <b>Título do Quiz</b> será o nome que aparecerá na sua lista de quizzes criados.</p>
          <p><b>2.</b> Adicione perguntas clicando no botão <b>“Adicionar Pergunta”</b>.</p>
          <p><b>3.</b> Para cada pergunta, crie <b>4 respostas</b> clicando em <b>“Adicionar Resposta”</b>. 
          Selecione a correta clicando na <b>bolinha ao lado da resposta</b>.</p>
          <p><b>4.</b> Após adicionar até <b>10 perguntas</b>, clique em <b>“Criar Quiz”</b> para finalizar.</p>
          <p><b>5.</b> Depois vá em <b>“Meus Jogos”</b> para visualizar o quiz criado.</p>
        </div>
      `,
      confirmButtonText: "Entendido",
      customClass: {
        popup: "swal-wide",
        confirmButton: "swal-button",
      },
    });
  };

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

  const deleteQuestion = (qIndex) => {
    setQuestions(questions.filter((_, index) => index !== qIndex));
  };

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

  const deleteAnswer = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.filter((_, index) => index !== aIndex);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const updateAnswer = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex].text = value;
    setQuestions(newQuestions);
  };

  const setCorrectAnswer = (qIndex, aIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers = newQuestions[qIndex].answers.map((ans, i) => ({
      ...ans,
      isCorrect: i === aIndex,
    }));
    setQuestions(newQuestions);
  };

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, title, questions }),
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
        <div className="title-row">
          <h2>Criar Novo Quiz</h2>
          <button className="help-button" type="button" onClick={showInstructions}>
            ❓ Instruções
          </button>
        </div>

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
                <Trash2 className="delete-icon-quizz" onClick={() => deleteQuestion(qIndex)} />
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
                  <Trash2 className="delete-icon-quizz" onClick={() => deleteAnswer(qIndex, aIndex)} />
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

