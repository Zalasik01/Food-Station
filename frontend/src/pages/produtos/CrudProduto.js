import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import './CrudProduto.scss';
import { useNavigate } from 'react-router-dom';
import UsuarioDropdown from '../../components/UsuarioDropdown/UsuarioDropdown';
import ControleEstoqueModal from '../../components/ControleEstoqueModal';
import '../../components/ControleEstoqueModal.scss';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Toast para feedback visual
const showToast = (message, type) => {
  switch (type) {
    case 'sucesso':
      toast.success(message);
      break;
    case 'erro':
      toast.error(message);
      break;
    case 'info':
      toast.info(message);
      break;
    default:
      toast(message);
  }
};

const CrudProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const nomeUsuario = usuario.nome || 'Usuário';
  const isAdmin = usuario.administrador === true || usuario.administrador === "true";

  const [form, setForm] = useState({ 
    nome: '', 
    preco: '', 
    quantidade_estoque: '', 
    estoque_minimo: '10',
    ativo: true 
  });
  const [originalForm, setOriginalForm] = useState(null);
  const [editMode, setEditMode] = useState(!!id);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [estoqueModalOpen, setEstoqueModalOpen] = useState(false);
  const [entradasEstoque, setEntradasEstoque] = useState([]);
  const [editMovimentacao, setEditMovimentacao] = useState(null);
  const [estoqueCaixas, setEstoqueCaixas] = useState('1');
  const [estoquePorCaixa, setEstoquePorCaixa] = useState('1');

  // Calcular quantidade baseada no fator de conversão
  const calcularQuantidade = () => {
    const caixas = parseInt(form.quantidade_caixas) || 0;
    const porCaixa = parseInt(form.quantidade_por_caixa) || 1;
    return caixas * porCaixa;
  };

  // Calcular quantidade para adição de estoque
  const calcularQuantidadeEstoque = () => {
    const caixas = parseInt(estoqueCaixas) || 0;
    const porCaixa = parseInt(estoquePorCaixa) || 1;
    return caixas * porCaixa;
  };

  // Adicionar estoque ao produto
  const handleAdicionarEstoque = async () => {
    if (!estoqueCaixas || !estoquePorCaixa || parseInt(estoqueCaixas) <= 0 || parseInt(estoquePorCaixa) <= 0) {
      showToast('Informe valores válidos para caixas e quantidade por caixa', 'erro');
      return;
    }

    // Calcular quantidade antes da requisição para evitar problemas de estado
    const quantidadeCalculada = parseInt(estoqueCaixas) * parseInt(estoquePorCaixa);

    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/produtos/${id}/atualizar-estoque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantidade_caixas: parseInt(estoqueCaixas),
          quantidade_por_caixa: parseInt(estoquePorCaixa)
        })
      });

      if (res.ok) {
        const result = await res.json();
        // Atualizar o estoque atual no formulário
        setForm(prev => ({
          ...prev,
          quantidade_estoque: String(result.produto.quantidade_estoque)
        }));
        
        // Adicionar a nova movimentação à lista local
        if (result.movimentacao) {
          setEntradasEstoque(prev => [result.movimentacao, ...prev]);
        }
        
        // Limpar os campos
        setEstoqueCaixas('1');
        setEstoquePorCaixa('1');
        showToast(`Estoque atualizado! Adicionado: ${quantidadeCalculada} unidades`, 'sucesso');
      } else {
        const errorData = await res.json();
        showToast(errorData.error || 'Erro ao atualizar estoque', 'erro');
      }
    } catch (error) {
      showToast('Erro ao atualizar estoque', 'erro');
    } finally {
      setLoading(false);
    }
  };

  // Excluir movimentação de estoque
  const handleExcluirMovimentacao = async (idMovimentacao) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/controle-estoque/${idMovimentacao}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Movimentação excluída com sucesso!', 'sucesso');
        setEntradasEstoque(entradasEstoque.filter(e => e.id !== idMovimentacao));
      } else {
        showToast('Erro ao excluir movimentação.', 'erro');
      }
    } catch {
      showToast('Erro ao excluir movimentação.', 'erro');
    }
  };

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
          const produtoForm = {
            nome: data.nome || '',
            preco: data.valor !== undefined && data.valor !== null ? formatCurrency((data.valor * 100).toString()) : '',
            quantidade_estoque: data.quantidade_estoque !== undefined && data.quantidade_estoque !== null ? String(data.quantidade_estoque) : '',
            estoque_minimo: data.estoque_minimo !== undefined && data.estoque_minimo !== null ? String(data.estoque_minimo) : '10',
            ativo: data.ativo === undefined ? true : (data.ativo === true || data.ativo === 'true')
          };
          setForm(produtoForm);
          setOriginalForm(produtoForm);
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
    // Validação: só atualiza se houve alteração
    if (id && originalForm) {
      const atual = {
        nome: form.nome,
        preco: form.preco,
        quantidade_estoque: form.quantidade_estoque,
        ativo: !!form.ativo
      };
      const original = {
        nome: originalForm.nome,
        preco: originalForm.preco,
        quantidade_estoque: originalForm.quantidade_estoque,
        ativo: !!originalForm.ativo
      };
      const alterado = Object.keys(atual).some(k => atual[k] !== original[k]);
      if (!alterado) {
        setLoading(false);
        showToast('Nenhuma alteração detectada.', 'erro');
        return;
      }
    }
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
          estoque_minimo: parseInt(form.estoque_minimo),
          ativo: !!form.ativo
        })
      });
      if (res.ok) {
        showToast(id ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!', 'sucesso');
        if (!id) setForm({ 
          nome: '', 
          preco: '', 
          quantidade_estoque: '', 
          estoque_minimo: '10',
          ativo: true 
        });
        // Removido navigate('/produtos')
      } else {
        showToast('Erro ao salvar produto.', 'erro');
      }
    } catch {
      showToast('Erro ao salvar produto.', 'erro');
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

                <div className="crud-produto__field">
                  <label htmlFor="estoque_minimo" className="crud-produto__label">Estoque Mínimo</label>
                  <input 
                    type="number" 
                    name="estoque_minimo" 
                    id="estoque_minimo" 
                    value={form.estoque_minimo} 
                    onChange={handleChange} 
                    required 
                    min="1" 
                    placeholder="Ex: 10" 
                    className="crud-produto__input"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Seção Adicionar Estoque - Apenas no modo edição */}
          {editMode && (
            <div className="crud-produto__card">
              <h3 className="crud-produto__bloco-titulo">Adicionar Estoque</h3>
              <div className="crud-produto__fields-row">
                <div className="crud-produto__field">
                  <label htmlFor="estoque_caixas" className="crud-produto__label">Quantidade de Caixas</label>
                  <input 
                    type="number" 
                    id="estoque_caixas" 
                    value={estoqueCaixas} 
                    onChange={(e) => setEstoqueCaixas(e.target.value)}
                    min="1" 
                    placeholder="Ex: 5" 
                    className="crud-produto__input"
                  />
                </div>

                <div className="crud-produto__field">
                  <label htmlFor="estoque_por_caixa" className="crud-produto__label">Quantidade por Caixa</label>
                  <input 
                    type="number" 
                    id="estoque_por_caixa" 
                    value={estoquePorCaixa} 
                    onChange={(e) => setEstoquePorCaixa(e.target.value)}
                    min="1" 
                    placeholder="Ex: 12" 
                    className="crud-produto__input"
                  />
                </div>

                <div className="crud-produto__field">
                  <label className="crud-produto__label">Total a Adicionar</label>
                  <div className="crud-produto__total-display">
                    <strong>{calcularQuantidadeEstoque()} unidades</strong>
                    <small>{estoqueCaixas} caixas × {estoquePorCaixa} unidades por caixa</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bloco Controle de Estoque */}
          <div className="crud-produto__card">
            <h3 className="crud-produto__bloco-titulo">Controle de Estoque</h3>
            <table className="crud-produto__estoque-tabela">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Antes</th>
                  <th>Depois</th>
                  <th>Adicionado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {entradasEstoque.length === 0 ? (
                  <tr><td colSpan={5}>Nenhuma movimentação registrada.</td></tr>
                ) : (
                  entradasEstoque.map(e => (
                    <tr key={e.id}>
                      <td>{e.data_compra ? new Date(e.data_compra).toLocaleDateString() : '-'}</td>
                      <td>{e.quantidade_antes || 0}</td>
                      <td>{e.quantidade_depois || 0}</td>
                      <td>{e.quantidade_adicionada || e.quantidade || 0}</td>
                      <td>
                        <button 
                          className="crud-produto__btn-estoque-edit" 
                          onClick={() => {
                            setEditMovimentacao(e);
                            setEstoqueModalOpen(true);
                          }}
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
          </div>
          </div>
        )}

        {/* Footer com botões */}
        <footer className="crud-produto__footer">
          <div className="crud-produto__footer-actions">
            <button 
              type="button" 
              className="crud-produto__btn-cancelar"
              onClick={() => navigate('/produtos')}
              disabled={loading}
            >
              Cancelar
            </button>
            
            {editMode && (
              <button 
                type="button" 
                className="crud-produto__btn-adicionar-estoque"
                onClick={handleAdicionarEstoque}
                disabled={loading || !estoqueCaixas || !estoquePorCaixa || parseInt(estoqueCaixas) <= 0 || parseInt(estoquePorCaixa) <= 0}
              >
                {loading ? 'Adicionando...' : 'Adicionar Estoque'}
              </button>
            )}
            
            <button 
              type="button" 
              className="crud-produto__btn-salvar"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Salvando...' : (editMode ? 'Atualizar' : 'Salvar')}
            </button>
          </div>
        </footer>

      </main>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="crud-produto__toast"
        onClick={e => {
          // Copia o texto da notificação ao clicar
          const text = e.target.innerText || e.target.textContent;
          if (text) {
            navigator.clipboard.writeText(text);
          }
        }}
      />
    </div>
  );
};

export default CrudProduto;
