import React, { useState } from 'react';
import './usuarioDropdown.scss';

const UsuarioDropdown = ({ nome, onLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="usuario-dropdown">
      <button
        className="usuario-dropdown__trigger"
        onClick={() => setOpen(!open)}
      >
        {nome}
        <span className="usuario-dropdown__arrow">▼</span>
      </button>
      {open && (
        <div className="usuario-dropdown__menu">
          <button className="usuario-dropdown__item" onClick={onLogout}>
            Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default UsuarioDropdown;
