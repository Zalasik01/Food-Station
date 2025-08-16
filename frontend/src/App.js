import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PainelControle from './pages/painelControle';
import Funcionarios from './pages/funcionarios';
import Refeicoes from './pages/refeicoes';
import Relatorios from './pages/relatorios';
import Cardapio from './pages/cardapio';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/painel" element={<PainelControle />} />
      <Route path="/funcionarios" element={<Funcionarios />} />
      <Route path="/refeicoes" element={<Refeicoes />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/cardapio" element={<Cardapio />} />
    </Routes>
  );
};

export default App;
