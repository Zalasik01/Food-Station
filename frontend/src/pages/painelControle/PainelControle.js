import React from 'react';
import './painelControle.scss';

const PainelControle = () => {
  return (
    <div className="painelControle">
      <h1 className="painelControle__titulo">Painel de Controle</h1>
      
      <div className="painelControle__metricas">
        <div className="painelControle__metrica">
          <h3>Total de Funcionários</h3>
          <span className="painelControle__numero">150</span>
        </div>
        
        <div className="painelControle__metrica">
          <h3>Refeições Hoje</h3>
          <span className="painelControle__numero">89</span>
        </div>
        
        <div className="painelControle__metrica">
          <h3>Cardápio Ativo</h3>
          <span className="painelControle__numero">12</span>
        </div>
        
        <div className="painelControle__metrica">
          <h3>Relatórios</h3>
          <span className="painelControle__numero">5</span>
        </div>
      </div>
      
      <div className="painelControle__grafico">
        <h2>Estatísticas de Refeições</h2>
        {/* Aqui virá o gráfico */}
      </div>
    </div>
  );
};

export default PainelControle;
