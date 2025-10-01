import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./components/header/header";
import "./PlaySequenceGame.css";

const API_URL = import.meta.env.VITE_API_URL;

const PlaySequenceGame = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [slots, setSlots] = useState([]);
  const [cards, setCards] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [results, setResults] = useState({ correct: 0, wrong: 0 });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  useEffect(() => {
    const fetchGame = async () => {
      const response = await fetch(`${API_URL}/sequence-games/${id}`);
      const data = await response.json();
      setGame(data);

      setSlots(Array(data.cards.length).fill(null));
      // setCards(data.cards);
      setCards(shuffleArray(data.cards)); //embaralha os cards
      setStartTime(Date.now());
    };

    fetchGame();
  }, [id]);

  const handleDrop = (slotIndex, card) => {
    const newSlots = [...slots];

    // 🔹 Remover o card de qualquer slot anterior em que ele esteja
    const previousSlotIndex = newSlots.findIndex((c) => c && c.id === card.id);
    if (previousSlotIndex !== -1) {
      newSlots[previousSlotIndex] = null;
    }

    // 🔹 Se já existir um card no slot de destino, ele volta para a pool de cards
    const replacedCard = newSlots[slotIndex];
    let newCards = cards.filter((c) => c.id !== card.id); // remove o card que estamos movendo
    if (replacedCard) {
      newCards = [...newCards, replacedCard]; // adiciona de volta à pool
    }

    // 🔹 Colocar o card no novo slot
    newSlots[slotIndex] = card;

    setSlots(newSlots);
    setCards(newCards);
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDropSlot = (e, slotIndex) => {
    const cardId = e.dataTransfer.getData("cardId");
    const card = [...cards, ...slots.filter(Boolean)].find(
      (c) => c.id.toString() === cardId
    );
    if (card) {
      handleDrop(slotIndex, card);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFromSlot = (slotIndex) => {
    const newSlots = [...slots];
    const removedCard = newSlots[slotIndex];

    if (removedCard) {
      setCards((prev) => [...prev, removedCard]);
      newSlots[slotIndex] = null;
      setSlots(newSlots);
    }
  };

  const handleFinish = async () => {
    const endTime = Date.now();
    const totalSeconds = Math.floor((endTime - startTime) / 1000);
    setDuration(totalSeconds);

    // calcular acertos e erros
    let correct = 0;
    let wrong = 0;
    slots.forEach((card, index) => {
      if (card) {
        if (card.position === index + 1) {
          correct++;
        } else {
          wrong++;
        }
      }
    });
    setResults({ correct, wrong });

    // verifica login
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
    } else {
      const profileRes = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const user = await profileRes.json();
        setIsLoggedIn(true);

        // salvar score com acertos e erros
        await fetch(`${API_URL}/sequence-games/ranking/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            correctAnswers: correct,
            timeInSeconds: totalSeconds,
          }),
        });
      }
    }

    // buscar ranking atualizado
    const rankingRes = await fetch(`${API_URL}/sequence-games/ranking/${id}`);
    const rankingData = await rankingRes.json();
    setRanking(rankingData);

    setIsFinished(true);
  };

  // 🔄 função para reiniciar o jogo
  const restartGame = () => {
    setIsFinished(false);
    setSlots(Array(game.cards.length).fill(null));
    setCards(shuffleArray(data.cards));
    setResults({ correct: 0, wrong: 0 });
    setStartTime(Date.now());
  };

  if (!game) {
    return <p>Carregando jogo...</p>;
  }

  return (
    <>
      <Header />
      <div className="play-sequence-container">
        {!isFinished ? (
          <>
            <h2>{game.title}</h2>
            <p>{game.introduction_text}</p>

            <div className="sequence-slots">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className="slot"
                  onDrop={(e) => handleDropSlot(e, index)}
                  onDragOver={handleDragOver}
                >
                  <span className="slot-number">{index + 1}</span>
                  {slot && (
                    <div
                      className="card"
                      draggable
                      onDragStart={(e) => handleDragStart(e, slot)}
                      onClick={() => handleRemoveFromSlot(index)}
                    >
                      <img
                        src={slot.image_url && slot.image_url.trim() !== "" ? slot.image_url : "/images/sequencia.jpg"}
                        alt={slot.description}
                        onError={(e) => {
                          e.target.src = "/images/sequencia.jpg";
                        }}
                        className="card-img"
                      />
                      <p>{slot.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <h3>Arraste os cards:</h3>
            <div className="cards-pool">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, card)}
                >
                  <img
                    src={card.image_url && card.image_url.trim() !== "" ? card.image_url : "/images/sequencia.jpg"}
                    alt={card.description}
                    onError={(e) => {
                      e.target.src = "/images/sequencia.jpg";
                    }}
                    className="card-img"
                  />
                  <p>{card.description}</p>
                </div>
              ))}
            </div>

            <div className="finish-row">
              <button
                className="button-finish"
                onClick={handleFinish}
                disabled={!slots.some((slot) => slot !== null)}
              >
                ✅ Finalizar
              </button>
            </div>
          </>
        ) : (
          <div className="results">
            <h2>Fim do Jogo!</h2>
            <p>✅ Acertos: {results.correct}</p>
            <p>❌ Respostas Erradas: {results.wrong}</p>
            <p>⏱️ Tempo: {formatTime(duration)}</p>
            <button className="button-again" onClick={restartGame}>
              🔄 Jogar Novamente
            </button>

            <div className="ranking">
              <h3>🏆 Ranking</h3>
              {!isLoggedIn && (
                <p style={{ color: "#b00", fontWeight: "bold" }}>
                  🔐 Faça login para aparecer no ranking!
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
                      <th>Tempo</th>
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

export default PlaySequenceGame;

