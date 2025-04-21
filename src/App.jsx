import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Auth from "./Auth";
import Register from "./Register";
import Profile from "./Profile";
import CreateQuizz from "./CreateQuizz";
import MyActivities from "./MyActivities";
import PlayQuiz from "./PlayQuiz";
import StudentActivities from "./StudentActivities";
import FreeActivities from "./FreeActivities";
import ProtectedRoute from "./routes/ProtectedRoute";
import FreeQuizz from "./FreeQuizz";
import ControlPanel from "./ControlPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} /> {/* Tela de login/cadastro */}
        <Route path="/registrar" element={<Register />} /> {/* Tela de registro */}
        <Route path="/perfil" element={<Profile />} /> {/* Tela de Perfil */}
        <Route path="/student-activities" element={<StudentActivities />} /> {/* Tela de Consultar quizzes criado pelos professores */}
        <Route path="/free-activities" element={<FreeActivities />} /> {/* Tela de Consultar jogos livres */}
        <Route path="/free-quizz" element={<FreeQuizz />} /> {/* Tela de Consultar quizzes livres */}
        <Route path="/quizz/:id" element={<PlayQuiz />} /> {/* 🚀 Rota de jogo Quiz */}

        {/* 🚀 Protegendo as rotas de professor */}
        <Route
          path="/my-activities"
          element={
            <ProtectedRoute allowedRoles={["professor"]}>
              <MyActivities /> {/* Tela de Consultar quizzes professor */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-quizz"
          element={
            <ProtectedRoute allowedRoles={["professor"]}>
              <CreateQuizz /> {/* Tela de Criar Quizz */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["professor"]}>
              <Dashboard /> {/* Tela criar atividades */}
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/control-panel"
          element={
            <ProtectedRoute allowedRoles={["professor"]}>
              <ControlPanel /> {/* Tela criar atividades */}
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
