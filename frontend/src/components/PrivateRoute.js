import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [valid, setValid] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setValid(false);
      return;
    }
    // Validação do token com o backend
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.ok)
      .then(isValid => setValid(isValid))
      .catch(() => setValid(false));
  }, []);

  if (valid === null) return null; // Pode exibir um loader
  if (!valid) return <Navigate to="/login" replace />;
  return children;
};

export default PrivateRoute;
