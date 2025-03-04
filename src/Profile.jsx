import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({ id: "", name: "", email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/auth/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setUser({ id: data.id, name: data.name, email: data.email, password: "" });
    };

    fetchUserData();
  }, [navigate]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/auth/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      alert("Perfil atualizado com sucesso!");
    } else {
      alert("Erro ao atualizar perfil!");
    }
  };


  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
    );

    if (!confirmDelete) return; // Se o usuário cancelar, não faz nada

    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/auth/${user.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Conta deletada com sucesso!");
      localStorage.removeItem("token"); // Remove o token após deletar
      navigate("/"); // Redireciona para a página inicial
    } else {
      alert("Erro ao deletar conta!");
    }
  };





  return (
    <>
      <Header />
      <div className="profile-container">
        <h2>Meu Perfil</h2>
        <form onSubmit={handleUpdate}>
          <label>Nome:</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />

          <label>Email:</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <label>Nova Senha:</label>
          <input
            type="password"
            placeholder="Digite uma nova senha"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <button type="submit">Salvar Alterações</button>
          <button type="button" onClick={handleDelete} className="delete-btn">
            Deletar Conta
        </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
