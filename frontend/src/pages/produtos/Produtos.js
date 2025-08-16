import React from 'react';
import Menu from '../../components/Menu/Menu';
import './produtos.scss';
import { useNavigate } from 'react-router-dom';
import UsuarioDropdown from '../../components/UsuarioDropdown/UsuarioDropdown';

const Produtos = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const nomeUsuario = usuario.nome || 'Usuário';
  const isAdmin = usuario.administrador === true || usuario.administrador === "true";

  const [produtos, setProdutos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState('id');
  const [sortDir, setSortDir] = React.useState('asc');
  const handleSort = col => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };
  const produtosFiltrados = [...produtos]
    .filter(p => !search || (p.nome && p.nome.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortDir === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  React.useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${apiUrl}/produtos`);
        let data = await res.json();
        // Garante que produtos é sempre um array
        if (!Array.isArray(data)) {
          if (data && typeof data === 'object') {
            data = [data];
          } else {
            data = [];
          }
        }
        setProdutos(data);
      } catch (err) {
        setProdutos([]);
      }
      setLoading(false);
    };
    fetchProdutos();
  }, []);

  return (
    <div className="produtos">
      <header className="dashboard__menu">
        <Menu isAdmin={isAdmin} />
        <div style={{ position: 'absolute', right: '2rem', top: '1.5rem' }}>
          <UsuarioDropdown nome={nomeUsuario} onLogout={() => { localStorage.clear(); navigate('/login'); }} />
        </div>
      </header>
      <main className="produtos__conteudo">
        <div className="produtos__top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              className="produtos__search"
              type="text"
              placeholder="Buscar produto..."
              value={search || ''}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '350px', maxWidth: '100%' }}
            />
            <button
              className="produtos__search-btn"
              title="Buscar"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              onClick={() => setSearch(search)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
          <button className="produtos__novo" onClick={() => navigate('/novo-produto')}>Novo</button>
        </div>
        {loading ? (
          <p>Carregando produtos...</p>
        ) : (
          <div className="produtos__tabela-container">
            <table className="produtos__tabela">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} className="produtos__th-sortable">ID {sortBy === 'id' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginLeft:'4px',transform:sortDir==='asc'?"rotate(180deg)":"none"}}><path d="M6 9l6 6 6-6"/></svg>
                  )}</th>
                  <th onClick={() => handleSort('nome')} className="produtos__th-sortable">Nome {sortBy === 'nome' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginLeft:'4px',transform:sortDir==='asc'?"rotate(180deg)":"none"}}><path d="M6 9l6 6 6-6"/></svg>
                  )}</th>
                  <th onClick={() => handleSort('valor')} className="produtos__th-sortable">Valor {sortBy === 'valor' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginLeft:'4px',transform:sortDir==='asc'?"rotate(180deg)":"none"}}><path d="M6 9l6 6 6-6"/></svg>
                  )}</th>
                  <th onClick={() => handleSort('quantidade_estoque')} className="produtos__th-sortable">Quantidade em estoque {sortBy === 'quantidade_estoque' && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginLeft:'4px',transform:sortDir==='asc'?"rotate(180deg)":"none"}}><path d="M6 9l6 6 6-6"/></svg>
                  )}</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.length === 0 ? (
                  <tr><td colSpan={5}>Nenhum produto cadastrado.</td></tr>
                ) : (
                  produtosFiltrados.map(produto => (
                    <tr key={produto.id} style={{cursor:'pointer'}} onClick={e => {
                      // Evita navegação duplicada ao clicar no botão editar
                      if (e.target.closest('.produtos__edit-btn')) return;
                      navigate(`/editar-produto/${produto.id}`);
                    }}>
                      <td>{produto.id}</td>
                      <td>{produto.nome}</td>
                      <td>{produto.valor ? `R$ ${Number(String(produto.valor).replace(',','.')).toFixed(2)}` : '-'}</td>
                      <td>{produto.quantidade_estoque ?? '-'}</td>
                      <td>
                        <button className="produtos__edit-btn" title="Editar" onClick={e => {e.stopPropagation();navigate(`/editar-produto/${produto.id}`);}}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Produtos;
