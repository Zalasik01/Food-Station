import React from 'react';
import PropTypes from 'prop-types';
import './botaoCustomizado.scss';

const BotaoCustomizado = ({
  children,
  tipo = 'primario',
  tamanho = 'medio',
  variante = 'solido',
  desabilitado = false,
  carregando = false,
  icone = null,
  onClick,
  className = '',
  ...props
}) => {
  const handleClick = (e) => {
    if (!desabilitado && !carregando && onClick) {
      onClick(e);
    }
  };

  const classNames = [
    'botaoCustomizado',
    `botaoCustomizado--${tipo}`,
    `botaoCustomizado--${tamanho}`,
    `botaoCustomizado--${variante}`,
    desabilitado && 'botaoCustomizado--desabilitado',
    carregando && 'botaoCustomizado--carregando',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      onClick={handleClick}
      disabled={desabilitado || carregando}
      {...props}
    >
      {carregando && (
        <span className="botaoCustomizado__spinner" />
      )}
      {icone && !carregando && (
        <span className="botaoCustomizado__icone">
          {icone}
        </span>
      )}
      <span className="botaoCustomizado__texto">
        {children}
      </span>
    </button>
  );
};

BotaoCustomizado.propTypes = {
  children: PropTypes.node.isRequired,
  tipo: PropTypes.oneOf(['primario', 'secundario', 'sucesso', 'erro', 'alerta', 'info']),
  tamanho: PropTypes.oneOf(['pequeno', 'medio', 'grande']),
  variante: PropTypes.oneOf(['solido', 'outline', 'ghost']),
  desabilitado: PropTypes.bool,
  carregando: PropTypes.bool,
  icone: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default BotaoCustomizado;
