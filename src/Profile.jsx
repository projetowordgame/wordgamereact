import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({ id: "", name: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
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
      setUser({ id: data.id, name: data.name, email: data.email });
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (showPasswordFields && newPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    if (showPasswordFields && newPassword) {
      payload.password = newPassword;
    }

    const response = await fetch("http://localhost:3000/auth/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Perfil atualizado com sucesso!");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
    } else {
      alert("Erro ao atualizar perfil!");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/auth/${user.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Conta deletada com sucesso!");
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      alert("Erro ao deletar conta!");
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <h2>Meu Perfil</h2>
        <form onSubmit={handleUpdate} autoComplete="off">
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

          {!showPasswordFields ? (
            <button
              type="button"
              className="change-password-btn-profile"
              onClick={() => setShowPasswordFields(true)}
            >
              Trocar Senha
            </button>
          ) : (
            <>
              <label>Nova Senha:</label>
              <input
                autoComplete="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label>Confirmar Senha:</label>
              <input
                autoComplete="new-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                className="change-password-btn-profile"
                onClick={() => {
                  setNewPassword("");
                  setConfirmPassword("");
                  setShowPasswordFields(false);
                }}
              >
                Cancelar
              </button>
            </>
          )}

          <hr className="separator-line" />

          <div className="buttons-section">
            <button type="submit" className="action-btn-profile">Salvar Alterações</button>
            <button type="button" onClick={handleDelete} className="delete-btn">
              Deletar Conta
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
