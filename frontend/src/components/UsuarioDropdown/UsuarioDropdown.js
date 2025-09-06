import React, { useState } from 'react';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import './usuarioDropdown.scss';

const UsuarioDropdown = ({ nome, email, onLogout }) => {
  const [open, setOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
        <div className="usuario-dropdown__menu usuario-dropdown__menu--fade">
          <button
            className="usuario-dropdown__item"
            onClick={() => {
              setShowEditModal(true);
              setOpen(false);
            }}
          >
            Editar Perfil
          </button>
          <button className="usuario-dropdown__item" onClick={onLogout}>
            Sair
          </button>
        </div>
      )}
      {showEditModal && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          userProps={{ nome, email }}
        />
      )}
    </div>
  );
};

export default UsuarioDropdown;