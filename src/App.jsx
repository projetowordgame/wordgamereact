import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Auth from "./Auth";
import Register from "./Register";
import Profile from "./Profile";
import CreateQuizz from "./CreateQuizz";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} /> {/* Tela de login/cadastro */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Tela principal */}
        <Route path="/registrar" element={<Register />} /> {/* Tela de registro */}
        <Route path="/perfil" element={<Profile />} /> {/* Tela de Perfil */}
        <Route path="/create-quizz" element={<CreateQuizz />} /> {/* Tela de Criar Quizz */}
      </Routes>
    </Router>
  );
}

export default App;
