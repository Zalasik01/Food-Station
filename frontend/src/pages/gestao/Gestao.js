import React, { useState } from 'react';
import Menu from '../../components/Menu/Menu';
import './gestao.scss';
import { useNavigate } from 'react-router-dom';
import UsuarioDropdown from '../../components/UsuarioDropdown/UsuarioDropdown';

const Gestao = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const nomeUsuario = usuario.nome || 'Usuário';
  const isAdmin = usuario.administrador === true || usuario.administrador === "true";
  const [form, setForm] = useState({ nome: '', email: '', senha: '', administrador: false });
  const [msg, setMsg] = useState('');

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${apiUrl}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) setMsg('Usuário cadastrado com sucesso!');
    else setMsg('Erro ao cadastrar usuário.');
  };

  return (
    <div className="gestao">
      <header className="dashboard__menu">
        <Menu isAdmin={isAdmin} />
        <div style={{ position: 'absolute', right: '2rem', top: '1.5rem' }}>
          <UsuarioDropdown nome={nomeUsuario} onLogout={() => { localStorage.clear(); navigate('/login'); }} />
        </div>
      </header>
      <main className="gestao__conteudo">
        <h2>Cadastro de Usuário</h2>
        <form className="gestao__form" onSubmit={handleSubmit}>
          <input type="text" name="nome" placeholder="Nome" value={form.nome} onChange={handleInputChange} required className="gestao__input" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleInputChange} required className="gestao__input" />
          <input type="password" name="senha" placeholder="Senha" value={form.senha} onChange={handleInputChange} required className="gestao__input" />
          <label className="gestao__checkbox">
            <input type="checkbox" name="administrador" checked={form.administrador} onChange={handleInputChange} /> Administrador
          </label>
          <button type="submit" className="gestao__botao">Cadastrar</button>
        </form>
        {msg && <div className="gestao__msg">{msg}</div>}
      </main>
    </div>
  );
};

export default Gestao;
