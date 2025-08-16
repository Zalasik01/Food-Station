import React, { useState } from 'react';
import './dashboard.scss';
import UsuarioDropdown from '../../components/UsuarioDropdown/UsuarioDropdown';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';

const Dashboard = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const nomeUsuario = usuario.nome || 'Usuário';
  const isAdmin = usuario.administrador === true || usuario.administrador === "true";
  // adminOpen state removed, handled in Menu component
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    // Opcional: pode validar o token com o backend aqui
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard__menu">
        <Menu isAdmin={isAdmin} />
        <div style={{ position: 'absolute', right: '2rem', top: '1.5rem' }}>
          <UsuarioDropdown nome={nomeUsuario} onLogout={handleLogout} />
        </div>
      </header>
      <main className="dashboard__conteudo">
        <h1>Bem-vindo ao Food Station</h1>
        <p>Visualize os principais indicadores e acesse as funcionalidades do sistema.</p>
        {/* Aqui você pode adicionar cards, gráficos, etc. */}
      </main>
    </div>
  );
};

export default Dashboard;
