import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Auth from "./Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} /> {/* Tela de login/cadastro */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Tela principal */}
      </Routes>
    </Router>
  );
}

export default App;
