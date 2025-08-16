import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PainelControle from './pages/painelControle';
import Funcionarios from './pages/funcionarios';
import Refeicoes from './pages/refeicoes';
import Relatorios from './pages/relatorios';
import Cardapio from './pages/cardapio';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import PrivateRoute from './components/PrivateRoute';
import Gestao from './pages/gestao';
import Produtos from './pages/produtos';
import CrudProduto from './pages/produtos/CrudProduto';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/painel" element={<PrivateRoute><PainelControle /></PrivateRoute>} />
      <Route path="/funcionarios" element={<PrivateRoute><Funcionarios /></PrivateRoute>} />
      <Route path="/refeicoes" element={<PrivateRoute><Refeicoes /></PrivateRoute>} />
      <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
      <Route path="/cardapio" element={<PrivateRoute><Cardapio /></PrivateRoute>} />
      <Route path="/gestao" element={<PrivateRoute><Gestao /></PrivateRoute>} />
      <Route path="/produtos" element={<PrivateRoute><Produtos /></PrivateRoute>} />
      <Route path="/novo-produto" element={<PrivateRoute><CrudProduto /></PrivateRoute>} />
      <Route path="/editar-produto/:id" element={<PrivateRoute><CrudProduto /></PrivateRoute>} />
    </Routes>
  );
};

export default App;
