import React from 'react';
import './dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dashboard__menu">
        <nav>
          <ul className="dashboard__menu-list">
            <li>Funcionários</li>
            <li>Refeições</li>
            <li>Relatórios</li>
            <li>Cardápio</li>
            <li>Painel de Controle</li>
          </ul>
        </nav>
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
