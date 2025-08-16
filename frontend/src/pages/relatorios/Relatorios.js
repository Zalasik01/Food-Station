import React, { useState } from 'react';
import Menu from '../../components/Menu/Menu';
import './relatorios.scss';

const Relatorios = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const isAdmin = usuario.administrador === true || usuario.administrador === "true";
  const [filtros, setFiltros] = useState({
    dataInicio: '2025-08-01',
    dataFim: '2025-08-15',
    setor: '',
    tipoRefeicao: ''
  });

  const dadosRelatorio = {
    totalRefeicoes: 1250,
    totalFuncionarios: 150,
    mediaRefeicoesPorDia: 83,
    setorMaisAtivo: 'TI',
    refeicaoMaisPopular: 'Almoço'
  };

  return (
    <div className="relatorios">
      <header className="relatorios__menu">
        <Menu isAdmin={isAdmin} />
      </header>
      <div className="relatorios__cabecalho">
        <h1 className="relatorios__titulo">Relatórios</h1>
        <button className="relatorios__botaoExportar">
          Exportar PDF
        </button>
      </div>
      
      <div className="relatorios__filtros">
        <div className="relatorios__periodo">
          <label>Período:</label>
          <input 
            type="date" 
            value={filtros.dataInicio}
            onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
            className="relatorios__dataInicio"
          />
          <span>até</span>
          <input 
            type="date" 
            value={filtros.dataFim}
            onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
            className="relatorios__dataFim"
          />
        </div>
        
        <select 
          value={filtros.setor}
          onChange={(e) => setFiltros({...filtros, setor: e.target.value})}
          className="relatorios__filtroSetor"
        >
          <option value="">Todos os setores</option>
          <option value="TI">TI</option>
          <option value="RH">RH</option>
          <option value="Vendas">Vendas</option>
          <option value="Financeiro">Financeiro</option>
        </select>
        
        <select 
          value={filtros.tipoRefeicao}
          onChange={(e) => setFiltros({...filtros, tipoRefeicao: e.target.value})}
          className="relatorios__filtroTipo"
        >
          <option value="">Todos os tipos</option>
          <option value="Café da Manhã">Café da Manhã</option>
          <option value="Almoço">Almoço</option>
          <option value="Lanche">Lanche</option>
          <option value="Jantar">Jantar</option>
        </select>
        
        <button className="relatorios__botaoGerar">
          Gerar Relatório
        </button>
      </div>
      
      <div className="relatorios__resumo">
        <div className="relatorios__card">
          <h3>Total de Refeições</h3>
          <span className="relatorios__numero">{dadosRelatorio.totalRefeicoes}</span>
        </div>
        
        <div className="relatorios__card">
          <h3>Total de Funcionários</h3>
          <span className="relatorios__numero">{dadosRelatorio.totalFuncionarios}</span>
        </div>
        
        <div className="relatorios__card">
          <h3>Média por Dia</h3>
          <span className="relatorios__numero">{dadosRelatorio.mediaRefeicoesPorDia}</span>
        </div>
        
        <div className="relatorios__card">
          <h3>Setor Mais Ativo</h3>
          <span className="relatorios__texto">{dadosRelatorio.setorMaisAtivo}</span>
        </div>
        
        <div className="relatorios__card">
          <h3>Refeição Mais Popular</h3>
          <span className="relatorios__texto">{dadosRelatorio.refeicaoMaisPopular}</span>
        </div>
      </div>
      
      <div className="relatorios__graficos">
        <div className="relatorios__grafico">
          <h2>Refeições por Dia</h2>
          <div className="relatorios__graficoContainer">
            {/* Aqui virá o gráfico de linha */}
            <p>Gráfico de refeições por dia</p>
          </div>
        </div>
        
        <div className="relatorios__grafico">
          <h2>Distribuição por Setor</h2>
          <div className="relatorios__graficoContainer">
            {/* Aqui virá o gráfico de pizza */}
            <p>Gráfico de pizza por setor</p>
          </div>
        </div>
      </div>
      
      <div className="relatorios__tabela">
        <h2>Detalhamento por Funcionário</h2>
        <table>
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Setor</th>
              <th>Total Refeições</th>
              <th>Café da Manhã</th>
              <th>Almoço</th>
              <th>Lanche</th>
              <th>Jantar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>João Silva</td>
              <td>TI</td>
              <td>15</td>
              <td>5</td>
              <td>10</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Maria Santos</td>
              <td>RH</td>
              <td>12</td>
              <td>3</td>
              <td>9</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Pedro Costa</td>
              <td>Vendas</td>
              <td>18</td>
              <td>6</td>
              <td>12</td>
              <td>0</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Relatorios;
