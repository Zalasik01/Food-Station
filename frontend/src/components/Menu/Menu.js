import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import UsuarioDropdown from '../UsuarioDropdown/UsuarioDropdown'; // Adicione o import
import './Menu.scss';

const Menu = ({ isAdmin, usuario, onLogout }) => {
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <nav className="menu-nav" style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'space-between', // Corrige alinhamento
      alignItems: 'center',
      position: 'relative'
    }}>
      <ul className="menu-list">
        <li className="menu-item" onClick={() => navigate('/')}>Página Inicial</li>
        <li className="menu-item" onClick={() => navigate('/foodstation')}>Food Station</li>
        {isAdmin && (
          <li className="menu-item admin-menu-item" style={{ position: 'relative' }}
              onMouseEnter={() => setAdminOpen(true)}
              onMouseLeave={() => setAdminOpen(false)}>
            <button className="admin-dropdown-trigger" type="button">
              Administração
              <span className="admin-dropdown-icon">
                {adminOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
              </span>
            </button>
            {adminOpen && (
              <div className="admin-dropdown-menu">
                <button className="admin-dropdown-option" onClick={() => { setAdminOpen(false); navigate('/gestao'); }}>Usuários</button>
                <button className="admin-dropdown-option" onClick={() => { setAdminOpen(false); navigate('/produtos'); }}>Produtos</button>
                <button className="admin-dropdown-option" onClick={() => { setAdminOpen(false); navigate('/relatorios'); }}>Relatórios</button>
              </div>
            )}
          </li>
        )}
      </ul>
      {usuario && (
        <div style={{ marginRight: '1.5rem' }}>
          <UsuarioDropdown
            nome={usuario.nome}
            id={usuario.id}
            email={usuario.email}
            onLogout={onLogout}
          />
        </div>
      )}
    </nav>
  );
};

export default Menu;
