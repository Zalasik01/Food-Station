import React, { useState } from 'react';
import './administracao.scss';
import { useNavigate } from 'react-router-dom';
import UsuarioDropdown from '../../components/UsuarioDropdown/UsuarioDropdown';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Administracao = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const nomeUsuario = usuario.nome || 'Usuário';
  const isAdmin = usuario.administrador === true || usuario.administrador === "true";
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="administracao">
      <header className="dashboard__menu">
        <nav style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <ul className="dashboard__menu-list">
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Página Inicial</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/foodstation')}>Food Station</li>
            {isAdmin && (
              <li style={{ position: 'relative' }}
                  onMouseEnter={() => setAdminOpen(true)}
                  onMouseLeave={() => setAdminOpen(false)}>
                <button className="admin-dropdown-trigger" type="button">
                  Administração {adminOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </button>
                {adminOpen && (
                  <div className="admin-dropdown-menu">
                    <button onClick={() => { setAdminOpen(false); navigate('/gestao'); }}>Usuários</button>
                    <button onClick={() => { setAdminOpen(false); navigate('/produtos'); }}>Produtos</button>
                    <button onClick={() => { setAdminOpen(false); navigate('/relatorios'); }}>Relatórios</button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
        <div style={{ position: 'absolute', right: '2rem', top: '1.5rem' }}>
          <UsuarioDropdown nome={nomeUsuario} onLogout={() => { localStorage.clear(); navigate('/login'); }} />
        </div>
      </header>
      <main className="administracao__conteudo">
        <h2>Administração</h2>
      </main>
    </div>
  );
};

export default Administracao;
