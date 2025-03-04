import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css"; // Importa o CSS

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ name: "Meu Perfil" }); // Simula um usuário logado
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="header">
      <h1 className="logo" onClick={() => navigate("/")}>KidsGame</h1>
      <nav>
        {user ? (
          <div className="nav-links">
            <button onClick={() => navigate("/minhas-atividades")}>Minhas Atividades</button>
            <button onClick={() => navigate("/dashboard")}>Criar Atividade</button>
            <div className="user-menu">
              <button className="user-btn">{user.name} ▼</button>
              <div className="dropdown">
                <button onClick={() => navigate("/perfil")}>Perfil</button>
                <button onClick={handleLogout}>Sair</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="nav-links">
            <button onClick={() => navigate("/")}>Login</button>
            <button className="register-btn" onClick={() => navigate("/registrar")}>Registrar</button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
