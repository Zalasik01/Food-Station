import React, { useState } from 'react';
import './login.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    lembrarMe: false
  });

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.senha
        })
      });

      const data = await response.json();

      if (data.sucesso) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        navigate('/');
      } else {
        setErro(data.mensagem || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Erro ao conectar com o servidor. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__cabecalho">
          <div className="login__logo">
            <h1>Food Station</h1>
            <span>Autos360</span>
          </div>
          <p className="login__subtitulo">
            Sistema de Gerenciamento de Alimentação
          </p>
        </div>

        <form className="login__formulario" onSubmit={handleSubmit}>
          <div className="login__campo">
            <label htmlFor="email" className="login__label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="login__input"
              placeholder="Digite seu email"
              required
            />
          </div>

          <div className="login__campo">
            <label htmlFor="senha" className="login__label">
              Senha
            </label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={mostrarSenha ? "text" : "password"}
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                className="login__input"
                placeholder="Digite sua senha"
                required
                style={{ width: '100%', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="login__ver-senha-btn"
                tabIndex={-1}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {mostrarSenha ? <FaEyeSlash size={22} color="#888" /> : <FaEye size={22} color="#888" />}
              </button>
            </div>
          </div>

          <div className="login__opcoes">
            <label className="login__checkbox">
              <input
                type="checkbox"
                name="lembrarMe"
                checked={formData.lembrarMe}
                onChange={handleInputChange}
              />
              <span className="login__checkboxTexto">Lembrar-me</span>
            </label>
            <a href="#" className="login__esqueceuSenha">
              Esqueceu a senha?
            </a>
          </div>

          {erro && (
            <div className="login__erro">
              {erro}
            </div>
          )}

          <button
            type="submit"
            className={`login__botao ${carregando ? 'carregando' : ''}`}
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login__rodape">
          <p>© 2025 Autos360 - Todos os direitos reservados</p>
          <div className="login__versao">
            v1.0.0
          </div>
        </div>
      </div>

      <div className="login__imagem">
        <div className="login__imagemOverlay">
          <h2>Bem-vindo ao Food Station</h2>
          <p>
            Gerencie a alimentação da sua empresa de forma simples e eficiente.
            Controle refeições, funcionários e tenha relatórios completos em tempo real.
          </p>
          <ul className="login__recursos">
            <li>✓ Controle de funcionários</li>
            <li>✓ Gestão de refeições</li>
            <li>✓ Relatórios detalhados</li>
            <li>✓ Cardápio personalizado</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
