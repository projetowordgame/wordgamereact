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

  // Buscar usuário logado
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

  // Adicionar um novo card (máximo 8)
  const addCard = () => {
    if (cards.length < 8) {
      setCards([...cards, { image_url: "", description: "", position: cards.length + 1 }]);
    } else {
      Swal.fire({
        icon: "info",
        title: "Limite atingido",
        text: "O jogo pode ter no máximo 8 cards.",
      });
    }
  };

  // Excluir card
  const deleteCard = (index) => {
    const newCards = cards.filter((_, i) => i !== index);
    // Reorganizar posições
    newCards.forEach((c, i) => (c.position = i + 1));
    setCards(newCards);
  };

  // Atualizar campos do card
  const updateCard = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  // Enviar jogo para o backend
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
        <h2>Criar Novo Sequence Game</h2>
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
                required
              />
              <input
                type="text"
                placeholder="Descrição"
                value={card.description}
                onChange={(e) => updateCard(index, "description", e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Posição"
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
