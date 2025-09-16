import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import Swal from "sweetalert2";
import "./Profile.css";

const API_URL = import.meta.env.VITE_API_URL;

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

      const response = await fetch(`${API_URL}/auth/profile`, {
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
      Swal.fire({
        icon: "warning",
        title: "Senhas diferentes",
        text: "As senhas não coincidem!",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button'
        }
      });
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

    const response = await fetch(`${API_URL}/auth/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Perfil atualizado com sucesso!",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button'
        }
      });
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao atualizar perfil!",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button'
        }
      });
    }
  };

    const handleDelete = async () => {
      const result = await Swal.fire({
        title: "Tem certeza?",
        text: "Essa ação não pode ser desfeita. Sua conta será excluída.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        confirmButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'swal-button',
          cancelButton: 'swal-button'
        }
      });
    
      if (!result.isConfirmed) return;
    
      const token = localStorage.getItem("token");
    
      const response = await fetch(`${API_URL}/auth/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Conta excluída",
          text: "Sua conta foi excluída com sucesso.",
          customClass: {
            popup: 'swal-wide',
            confirmButton: 'swal-button'
          }
        });
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao deletar conta!",
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