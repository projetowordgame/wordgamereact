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

  useEffect(() => {
    const fetchGame = async () => {
      const response = await fetch(`${API_URL}/sequence-games/${id}`);
      const data = await response.json();
      setGame(data);

      // Cria os slots vazios conforme número de cards
      setSlots(Array(data.cards.length).fill(null));

      // Preenche os cards disponíveis
      setCards(data.cards);
    };

    fetchGame();
  }, [id]);

  const handleDrop = (slotIndex, card) => {
    const newSlots = [...slots];
    newSlots[slotIndex] = card;

    // Remove o card da área de "cards disponíveis"
    const newCards = cards.filter((c) => c.id !== card.id);

    // Se já tinha card no slot, devolve para "cards disponíveis"
    if (newSlots[slotIndex] && newSlots[slotIndex].id !== card.id) {
      newCards.push(newSlots[slotIndex]);
    }

    setSlots(newSlots);
    setCards(newCards);
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

  const handleFinish = () => {
    console.log("Sequência finalizada:", slots);
    alert("Jogo finalizado! Em breve irá para o ranking...");
  };

  const handleRemoveFromSlot = (slotIndex) => {
    const newSlots = [...slots];
    const removedCard = newSlots[slotIndex];

    if (removedCard) {
      setCards((prev) => [...prev, removedCard]); // devolve para área de escolha
      newSlots[slotIndex] = null;
      setSlots(newSlots);
    }
  };

  if (!game) {
    return <p>Carregando jogo...</p>;
  }

  return (
    <>
      <Header />
      <div className="play-sequence-container">
        <h2>{game.title}</h2>
        <p>{game.introduction_text}</p>

        {/* Espaços numerados para ordenar os cards */}
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
                  onClick={() => handleRemoveFromSlot(index)} // ✅ remover no clique
                >
                  <img src={slot.image_url} alt={slot.description} />
                  <p>{slot.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cards disponíveis */}
        <h3>Arraste os cards:</h3>
        <div className="cards-pool">
          {cards.map((card) => (
            <div
              key={card.id}
              className="card"
              draggable
              onDragStart={(e) => handleDragStart(e, card)}
            >
              <img src={card.image_url} alt={card.description} />
              <p>{card.description}</p>
            </div>
          ))}
        </div>

        {/* Botão de finalizar sempre visível */}
        <div className="finish-row">
          <button
            className="button-finish"
            onClick={handleFinish}
            disabled={!slots.some((slot) => slot !== null)} // ✅ só habilita se tiver card
          >
            ✅ Finalizar
          </button>
        </div>
      </div>
    </>
  );
};

export default PlaySequenceGame;

