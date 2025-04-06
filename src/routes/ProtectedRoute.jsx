import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Carregando...</h2>; // Tela de carregamento enquanto verifica o usuário
  }

  if (!user) {
    return <Navigate to="/login" />; // Redireciona se não estiver logado
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/student-activities" />; // 🚀 Se não tiver permissão, manda para /student-activities
  }

  return children;
};

export default ProtectedRoute;
