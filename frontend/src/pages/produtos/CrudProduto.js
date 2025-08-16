import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import './CrudProduto.scss';
import { useNavigate } from 'react-router-dom';
import UsuarioDropdown from '../../components/UsuarioDropdown/UsuarioDropdown';

const CrudProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const nomeUsuario = usuario.nome || 'Usuário';
  const isAdmin = usuario.administrador === true || usuario.administrador === "true";

  const [form, setForm] = useState({ nome: '', preco: '', quantidade_estoque: '' });
  const [editMode, setEditMode] = useState(!!id);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  React.useEffect(() => {
    if (id) {
      const fetchProduto = async () => {
        setLoading(true);
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
          const res = await fetch(`${apiUrl}/produtos/${id}`);
          const data = await res.json();
          setForm({
            nome: data.nome || '',
            preco: data.valor || '',
            quantidade_estoque: data.quantidade_estoque || '',
            ativo: data.ativo === true || data.ativo === 'true'
          });
        } catch {
          setMsg('Erro ao carregar produto.');
        }
        setLoading(false);
      };
      fetchProduto();
    }
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const url = id ? `${apiUrl}/produtos/${id}` : `${apiUrl}/produtos`;
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          valor: parseFloat(form.preco),
          quantidade_estoque: parseInt(form.quantidade_estoque),
          ativo: !!form.ativo
        })
      });
      if (res.ok) {
        setMsg(id ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
        if (!id) setForm({ nome: '', preco: '', quantidade_estoque: '', ativo: true });
      } else {
        setMsg('Erro ao salvar produto.');
      }
    } catch {
      setMsg('Erro ao salvar produto.');
    }
    setLoading(false);
  };

  return (
    <div className="crud-produto">
      <header className="dashboard__menu">
        <Menu isAdmin={isAdmin} />
        <div style={{ position: 'absolute', right: '2rem', top: '1.5rem' }}>
          <UsuarioDropdown nome={nomeUsuario} onLogout={() => { localStorage.clear(); navigate('/login'); }} />
        </div>
      </header>
      <main className="crud-produto__conteudo">
        <h2>{editMode ? 'Editar Produto' : 'Novo Produto'}</h2>
        <form className="crud-produto__form" onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
          <label>Preço:</label>
          <input type="number" name="preco" value={form.preco} onChange={handleChange} required min="0" step="0.01" />
          <label>Quantidade em estoque:</label>
          <input type="number" name="quantidade_estoque" value={form.quantidade_estoque} onChange={handleChange} required min="0" />
          <label className="crud-produto__switch">
            <input type="checkbox" name="ativo" checked={!!form.ativo} onChange={handleChange} /> Ativo
          </label>
          <button type="submit" disabled={loading}>{editMode ? 'Salvar' : 'Cadastrar'}</button>
        </form>
        {msg && <div className="crud-produto__msg">{msg}</div>}
      </main>
    </div>
  );
};

export default CrudProduto;
