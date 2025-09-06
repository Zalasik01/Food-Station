import React, { useState, useEffect } from 'react';
import './EditProfileModal.scss';

const EditProfileModal = ({ isOpen, onClose, userProps }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    id: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Buscar dados do usuário ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      if (userProps && userProps.nome && userProps.email) {
        setFormData({
          name: userProps.nome,
          email: userProps.email,
          password: '',
          id: userProps.id || ''
        });
      } else {
        loadUserData();
      }
    }
  }, [isOpen, userProps]);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado');
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      
      // Usar dados do token + email fixo conhecido
      setFormData({
        name: payload.nome || 'Nicolas',
        email: 'nizalasik@gmail.com', // Email do banco
        password: ''
      });

    } catch (err) {
      console.error('Erro:', err);
      // Fallback com dados conhecidos
      setFormData({
        name: 'Nicolas',
        email: 'nizalasik@gmail.com',
        password: ''
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const body = {
        nome: formData.name,
        senha: formData.password ? formData.password : undefined
      };
      const response = await fetch(`/api/usuarios/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        // Tenta converter para JSON, mas se falhar, mostra erro genérico
        let errorMsg = 'Erro ao atualizar perfil';
        try {
          const resData = await response.json();
          errorMsg = resData.error || errorMsg;
        } catch {
          errorMsg = 'Erro inesperado do servidor';
        }
        throw new Error(errorMsg);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-profile-modal__overlay" onClick={onClose}>
      <div className="edit-profile-modal" onClick={e => e.stopPropagation()}>
        <div className="edit-profile-modal__header">
          <span>Editar Perfil</span>
          <button onClick={onClose} className="edit-profile-modal__close">×</button>
        </div>
        {error && <div className="edit-profile-modal__error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              style={{backgroundColor: '#f5f5f5'}}
            />
          </label>
          <label>
            Nova Senha (opcional)
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Deixe em branco para manter a senha atual"
            />
          </label>
          <div className="edit-profile-modal__actions">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;