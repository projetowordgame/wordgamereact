import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token'); // Remove o token armazenado
    navigate('/login'); // Redireciona para a tela de login
  }, [navigate]);

  return <h2>Saindo...</h2>;
};

export default Logout;
