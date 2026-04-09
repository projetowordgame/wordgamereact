import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import "./MyActivities.css";

const API_URL = import.meta.env.VITE_API_URL;

const FreeGallow = () => {
  const [gallows, setGallows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGallows = async () => {
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

      // Obtém os jogos livres(usuario admin)
      const gallowResponse = await fetch(`${API_URL}/gallow/freegallow`, {
        method: "GET"
      });

      const gallowData = await gallowResponse.json();
      setGallows(gallowData);
    };

    fetchGallows();
  }, [navigate]);


  return (
    <>
      <Header />
      <div className="my-activities-container">
        <h2>Minhas Atividades</h2>
        <div className="quiz-list">
          {gallows.length === 0 ? (
            <p>Você ainda não criou nenhum Jogo da Forca.</p>
          ) : (
            gallows.map((gallow) => (
              <div key={gallow.id} className="quiz-card" onClick={() => navigate(`/gallow/${gallow.id}`)}>
                <img src="/images/forca.png" alt="Forca" className="forca-image" />
                <h3>{gallow.title}</h3>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default FreeGallow;
