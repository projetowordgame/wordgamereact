import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Header from "./components/header/header";
import "./CreateSequence.css";

const API_URL = import.meta.env.VITE_API_URL;

const CreateSequence = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [introductionText, setIntroductionText] = useState("");
  const [cards, setCards] = useState([]);
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
      title: "Instruções para criar um Jogo da Sequência",
      html: `
        <div style="text-align: left; font-size: 13px;">
          <ol style="text-align: left;">
            <li><b>Título do jogo</b>: será o nome que aparecerá para localizar e exibir o jogo aos alunos.</li>
            <li><b>Descrição curta</b>: insira uma frase explicando a sequência, como “Organize o ciclo da água nas etapas corretas” ou “Organize as letras em ordem alfabética”.</li>
            <li><b>Adicionar cards</b>: clique em “Adicionar card”. Cada card tem:
              <ul>
                <li><b>URL da imagem</b>: pode inserir o link da internet ou deixar em branco (usará imagem padrão).</li>
                <li><b>Nome do card</b>: é o texto do card, como “Evaporação” ou “A”.</li>
                <li><b>Posição correta</b>: número indicando a ordem certa (ex: “A” = 1, “C” = 3).</li>
              </ul>
            </li>
            <li>Após adicionar até 5 cards, clique em <b>“Finalizar”</b> e depois vá em <b>“Meus Jogos”</b> para visualizar o jogo criado.</li>
          </ol>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Entendi!",
      customClass: {
        popup: "swal-wide",
        confirmButton: "swal-button",
      },
    });
  };

  const addCard = () => {
    if (cards.length < 5) {
      setCards([...cards, { image_url: "", description: "", position: cards.length + 1 }]);
    } else {
      Swal.fire({
        icon: "info",
        title: "Limite atingido",
        text: "O jogo pode ter no máximo 5 cards.",
      });
    }
  };

  const deleteCard = (index) => {
    const newCards = cards.filter((_, i) => i !== index);
    newCards.forEach((c, i) => (c.position = i + 1));
    setCards(newCards);
  };

  const updateCard = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({ icon: "error", title: "Erro", text: "Usuário não autenticado." });
      return;
    }

    if (!title.trim() || !introductionText.trim() || cards.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "Informe título, introdução e pelo menos 1 card.",
      });
      return;
    }

    const response = await fetch(`${API_URL}/sequence-games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        introduction_text: introductionText,
        userId: user.id,
        cards,
      }),
    });

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Jogo criado com sucesso!",
        confirmButtonText: "Ir para o painel",
      });
      navigate("/dashboard");
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Houve um erro ao criar o jogo.",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="create-sequence-container">

        <div className="title-row">
          <h2>Criar Novo Jogo da Sequência</h2>
          <button className="instructions-button" type="button" onClick={showInstructions}>
            ❓ Instruções
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Título do Jogo:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Texto de Introdução:</label>
          <textarea
            value={introductionText}
            onChange={(e) => setIntroductionText(e.target.value)}
            required
          />

          <h3>Cards</h3>
          {cards.map((card, index) => (
            <div key={index} className="card-block">
              <div className="card-header">
                <span>Card {index + 1}</span>
                <Trash2 className="delete-icon-quizz" onClick={() => deleteCard(index)} />
              </div>

              <input
                type="text"
                placeholder="URL da Imagem"
                value={card.image_url}
                onChange={(e) => updateCard(index, "image_url", e.target.value)}
              />
              <input
                type="text"
                placeholder="Nome do Card"
                value={card.description}
                onChange={(e) => updateCard(index, "description", e.target.value)}
              />
              <input
                type="number"
                placeholder="Posição Correta"
                value={card.position}
                onChange={(e) => updateCard(index, "position", Number(e.target.value))}
                min="1"
                max="8"
                required
              />
            </div>
          ))}

          <div className="button-row">
            {cards.length < 8 && (
              <button type="button" className="button-pergunta" onClick={addCard}>
                + Adicionar Card
              </button>
            )}
            <button className="button-create" type="submit">Criar Jogo</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateSequence;
