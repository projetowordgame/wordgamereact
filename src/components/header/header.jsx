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
        .then((response) => response.json())
        .then((data) => {
          setUser(data); // Armazena os dados do usuário (incluindo o tipo)
        })
        .catch(() => setUser(null));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="header">
      <h1 className="logo" onClick={() => navigate("/home")}>WordGame</h1>
      <nav>
        {user ? (
          <div className="nav-links">
            <button onClick={() => navigate("/student-activities")}>Atividades de Professores</button>
            <button onClick={() => navigate("/free-activities")}>Atividades Livres</button>

            {/* Exibe apenas se for professor */}
            {user.role === "professor" && (
              <>
                <button onClick={() => navigate("/my-activities")}>Minhas Atividades</button>
                <button onClick={() => navigate("/dashboard")}>Criar Atividade</button>
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
