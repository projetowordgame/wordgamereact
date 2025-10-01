import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import "./MyActivities.css";

const API_URL = import.meta.env.VITE_API_URL;

const FreeSequence = () => {
  const [sequences, setSequences] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSequences = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Obtém o usuário logado
      const userResponse = await fetch(`${API_URL}/auth/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = await userResponse.json();
      const userId = userData.id;

      // Obtém os sequences livres(usuario admin)
      const sequenceResponse = await fetch(`${API_URL}/sequence-games/freesequence`, {
        method: "GET"
      });

      const sequenceData = await sequenceResponse.json();
      setSequences(sequenceData);
    };

    fetchSequences();
  }, [navigate]);


  return (
    <>
      <Header />
      <div className="my-activities-container">
        <h2>Minhas Atividades</h2>
        <div className="quiz-list">
          {sequences.length === 0 ? (
            <p>Você ainda não criou nenhum Jogo da sequencia.</p>
          ) : (
            sequences.map((sequence) => (
              <div key={sequence.id} className="quiz-card" onClick={() => navigate(`/sequence-games/${sequence.id}`)}>
                <img src="/images/sequencia.jpg" alt="Sequencia" className="sequencia-image" />
                <h3>{sequence.title}</h3>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default FreeSequence;
