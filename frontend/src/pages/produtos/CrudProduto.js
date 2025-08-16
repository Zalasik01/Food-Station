import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import './CrudProduto.scss';
import { useNavigate } from 'react-router-dom';
import UsuarioDropdown from '../../components/UsuarioDropdown/UsuarioDropdown';
import ControleEstoqueModal from '../../components/ControleEstoqueModal';
import '../../components/ControleEstoqueModal.scss';

const CrudProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const nomeUsuario = usuario.nome || 'Usuário';
  const isAdmin = usuario.administrador === true || usuario.administrador === "true";

  const [form, setForm] = useState({ nome: '', preco: '', quantidade_estoque: '', ativo: true });
  const [editMode, setEditMode] = useState(!!id);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [estoqueModalOpen, setEstoqueModalOpen] = useState(false);
  const [entradasEstoque, setEntradasEstoque] = useState([]);

  const formatCurrency = (value) => {
    if (!value) return '';
    const numValue = value.toString().replace(/\D/g, '');
    const formattedValue = (parseFloat(numValue) / 100).toFixed(2);
    return formattedValue.replace('.', ',');
  };

  const parseCurrency = (value) => {
    if (!value) return '';
    return value.replace(',', '.');
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'preco') {
      const numericValue = value.replace(/\D/g, '');
      const formattedValue = formatCurrency(numericValue);
      setForm({ ...form, [name]: formattedValue });
    } else if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
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
            preco: data.valor !== undefined && data.valor !== null ? formatCurrency((data.valor * 100).toString()) : '',
            quantidade_estoque: data.quantidade_estoque !== undefined && data.quantidade_estoque !== null ? String(data.quantidade_estoque) : '',
            ativo: data.ativo === undefined ? true : (data.ativo === true || data.ativo === 'true')
          });
        } catch {
          setMsg('Erro ao carregar produto.');
        }
        setLoading(false);
      };
      fetchProduto();
    }
  }, [id]);

  React.useEffect(() => {
    if (id) {
      const fetchEntradas = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
          const res = await fetch(`${apiUrl}/controle-estoque/${id}`);
          const data = await res.json();
          setEntradasEstoque(Array.isArray(data) ? data : []);
        } catch {
          setEntradasEstoque([]);
        }
      };
      fetchEntradas();
    }
  }, [id, estoqueModalOpen]);

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
          valor: parseFloat(parseCurrency(form.preco)),
          quantidade_estoque: parseInt(form.quantidade_estoque),
          ativo: !!form.ativo
        })
      });
      if (res.ok) {
        setMsg(id ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
        if (!id) setForm({ nome: '', preco: '', quantidade_estoque: '', ativo: true });
        setTimeout(() => {
          navigate('/produtos');
        }, 1500);
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
        <div className="crud-produto__header">
          <h1 className="crud-produto__titulo">{editMode ? 'Editar Produto' : 'Novo Produto'}</h1>
          <button 
            className="crud-produto__btn-voltar" 
            onClick={() => navigate('/produtos')}
            type="button"
          >
            ← Voltar
          </button>
        </div>

        {loading ? (
          <div className="crud-produto__skeleton">
            <div className="skeleton-switch"></div>
            <div className="skeleton-row">
              <div className="skeleton-field"></div>
              <div className="skeleton-field"></div>
              <div className="skeleton-field"></div>
            </div>
            <div className="skeleton-button"></div>
          </div>
        ) : (
          <div className="crud-produto__container">
            {/* Bloco Principal */}
            <div className="crud-produto__card">
              <h3 className="crud-produto__bloco-titulo">Principal</h3>
              <form className="crud-produto__form" onSubmit={handleSubmit}>
              
              {/* Switch Ativo */}
              <div className="crud-produto__switch-container">
                <label className="crud-produto__switch">
                  <input 
                    type="checkbox" 
                    name="ativo" 
                    checked={!!form.ativo} 
                    onChange={handleChange}
                  />
                  <span className="crud-produto__slider"></span>
                </label>
                <span className="crud-produto__switch-label">
                  Produto {form.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              {/* Campos do formulário */}
              <div className="crud-produto__fields-row">
                <div className="crud-produto__field">
                  <label htmlFor="nome" className="crud-produto__label">Nome do Produto</label>
                  <input 
                    type="text" 
                    name="nome" 
                    id="nome" 
                    value={form.nome} 
                    onChange={handleChange} 
                    required 
                    placeholder="Ex: Arroz integral" 
                    className="crud-produto__input"
                  />
                </div>

                <div className="crud-produto__field">
                  <label htmlFor="preco" className="crud-produto__label">Valor (R$)</label>
                  <input 
                    type="text" 
                    name="preco" 
                    id="preco" 
                    value={form.preco} 
                    onChange={handleChange} 
                    required 
                    placeholder="0,00" 
                    className="crud-produto__input"
                  />
                </div>

                <div className="crud-produto__field">
                  <label htmlFor="quantidade_estoque" className="crud-produto__label">Quantidade em Estoque</label>
                  <input 
                    type="number" 
                    name="quantidade_estoque" 
                    id="quantidade_estoque" 
                    value={form.quantidade_estoque} 
                    onChange={handleChange} 
                    required 
                    min="0" 
                    placeholder="Ex: 50" 
                    className="crud-produto__input"
                  />
                </div>
              </div>

              <div className="crud-produto__actions">
                <button 
                  type="button" 
                  className="crud-produto__btn-cancelar"
                  onClick={() => navigate('/produtos')}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="crud-produto__btn-salvar"
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : (editMode ? 'Atualizar' : 'Cadastrar')}
                </button>
              </div>
            </form>
          </div>

          {/* Bloco Controle de Estoque */}
          <div className="crud-produto__card">
            <h3 className="crud-produto__bloco-titulo">Controle de Estoque</h3>
            <button className="crud-produto__btn-registrar" onClick={() => setEstoqueModalOpen(true)}>
              Registrar produto
            </button>
            <table className="crud-produto__estoque-tabela">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Quantidade</th>
                  <th>Usuário</th>
                </tr>
              </thead>
              <tbody>
                {entradasEstoque.length === 0 ? (
                  <tr><td colSpan={5}>Nenhuma entrada registrada.</td></tr>
                ) : (
                  entradasEstoque.map(e => (
                    <tr key={e.id}>
                      <td>{e.data_compra ? new Date(e.data_compra).toLocaleDateString() : '-'}</td>
                      <td>{e.quantidade}</td>
                      <td>{e.usuario_nome || 'N/A'}</td>
                      <td>
                        <button 
                          className="crud-produto__btn-estoque-edit" 
                          onClick={() => setEstoqueModalOpen({ open: true, edit: true, movimentacao: e })}
                        >Editar</button>
                        <button 
                          className="crud-produto__btn-estoque-delete" 
                          onClick={() => handleExcluirMovimentacao(e.id)}
                        >Excluir</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <ControleEstoqueModal
              open={estoqueModalOpen}
              onClose={() => setEstoqueModalOpen(false)}
              onSave={() => setEstoqueModalOpen(false)}
              idProduto={id}
            />
          </div>
          </div>
        )}

        {msg && (
          <div className={`crud-produto__msg ${msg.includes('sucesso') ? 'crud-produto__msg--sucesso' : 'crud-produto__msg--erro'}`}>
            {msg}
          </div>
        )}
      </main>
    </div>
  );
};

export default CrudProduto;
