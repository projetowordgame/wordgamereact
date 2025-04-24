import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css"; // Importa o CSS

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/auth/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              // Token expirado ou inválido
              handleLogout(); // Remove token e redireciona
            }
            throw new Error("Falha na autenticação");
          }
          return response.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.error("Erro ao buscar perfil:", err);
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="header">
      <h1 className="logo" onClick={() => navigate("/")}>Learn by Playing</h1>
      <nav>
        {user ? (
          <div className="nav-links">
            <button onClick={() => navigate("/student-activities")}>Área do Professor</button>
            <button onClick={() => navigate("/free-activities")}>Área do Aluno</button>

            {/* Exibe apenas se for professor */}
            {user.role === "professor" && (
              <>
                <button onClick={() => navigate("/my-activities")}>Meus Jogos</button>
                <button onClick={() => navigate("/dashboard")}>Criar Jogo</button>
                <button onClick={() => navigate("/control-panel")}>Painel de Controle</button>
              </>
            )}

            <div className="user-menu">
              <button className="user-btn">Meu Perfil ▼</button>
              <div className="dropdown">
                <button onClick={() => navigate("/perfil")}>Perfil</button>
                <button onClick={handleLogout}>Sair</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="nav-links">
            <button onClick={() => navigate("/login")}>Login</button>
            <button className="register-btn" onClick={() => navigate("/registrar")}>Registrar</button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
