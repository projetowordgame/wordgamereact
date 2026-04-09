import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "./components/header/header";
import "./CreateSequence.css";

const API_URL = import.meta.env.VITE_API_URL;

const CreateGallow = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [tip1, setTip1] = useState("");
  const [tip2, setTip2] = useState("");
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
            <p><b>1.</b> O <b>Título do Quiz</b> será o nome que aparecerá na sua lista de Jogo da forca criados.</p>
            <p><b>2.</b> Adicione a palavra secreta no campo <b>“Palavra secreta”</b>, é a palavra que o aluno deverá descobrir.</p>
            <p><b>3.</b> Insira <b>2 dicas</b> da palavra secreta para o aluno tentar acertar, lembrando que ao pedir dica ele consumirá um membro do boneco da forca</b>. 
            <p><b>4.</b> Após preencher os campos, clique em <b>“Criar Jogo”</b> para finalizar.</p>
            <p><b>5.</b> Depois vá em <b>“Meus Jogos”</b> para visualizar o jogo da forca criado.</p>
          </div>
        `,
        confirmButtonText: "Entendido",
        customClass: {
          popup: "swal-wide",
          confirmButton: "swal-button",
        },
      });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      Swal.fire({ icon: "error", title: "Erro", text: "Usuário não autenticado." });
      return;
    }

    if (!title.trim() || !keyword.trim() || !tip1.trim() || !tip2.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "Preencha todos os campos do jogo.",
      });
      return;
    }

    const response = await fetch(`${API_URL}/gallow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        keyword,
        tip1,
        tip2,
        userId: user.id,
      }),
    });

    if (response.ok) {
      await Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Jogo da Forca criado com sucesso!",
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
        {/* <h2>Criar Novo Jogo da Forca</h2> */}



        <div className="title-row">
          <h2>Criar Novo Jogo da Forca</h2>
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

          <label>Palavra Secreta:</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
          />

          <label>Dica 1:</label>
          <input
            type="text"
            value={tip1}
            onChange={(e) => setTip1(e.target.value)}
            required
          />

          <label>Dica 2:</label>
          <input
            type="text"
            value={tip2}
            onChange={(e) => setTip2(e.target.value)}
            required
          />

          <div className="button-row">
            <button className="button-create" type="submit">Criar Jogo</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateGallow;
