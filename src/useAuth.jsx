import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      navigate('/login'); // Se não estiver logado, redireciona
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  return { isAuthenticated };
};

export default useAuth;

