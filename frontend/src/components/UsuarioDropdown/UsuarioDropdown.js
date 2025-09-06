import React, { useState } from 'react';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import './usuarioDropdown.scss';

const UsuarioDropdown = ({ nome, id, email, onLogout }) => {
  const [open, setOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  console.log('UsuarioDropdown props:', { nome, id, email }); // Debug

  return (
    <div className="usuario-dropdown">
      <button
        className="usuario-dropdown__trigger"
        onClick={() => setOpen(!open)}
      >
        {nome} ({id})
        <span className="usuario-dropdown__arrow">▼</span>
      </button>
      {open && (
        <div className="usuario-dropdown__menu">
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
          userProps={{ nome, id, email }} // Passar as props do usuário
        />
      )}
    </div>
  );
};

export default UsuarioDropdown;
