import React, { useState } from 'react';
import './refeicoes.scss';

const Refeicoes = () => {
  const [refeicoes, setRefeicoes] = useState([
    { 
      id: 1, 
      funcionario: 'João Silva', 
      tipo: 'Almoço', 
      data: '2025-08-15', 
      horario: '12:30',
      status: 'Confirmada' 
    },
    { 
      id: 2, 
      funcionario: 'Maria Santos', 
      tipo: 'Jantar', 
      data: '2025-08-15', 
      horario: '19:00',
      status: 'Pendente' 
    },
    { 
      id: 3, 
      funcionario: 'Pedro Costa', 
      tipo: 'Café da Manhã', 
      data: '2025-08-15', 
      horario: '08:00',
      status: 'Cancelada' 
    },
  ]);

  const [filtroData, setFiltroData] = useState('2025-08-15');
  const [filtroTipo, setFiltroTipo] = useState('');

  return (
    <div className="refeicoes">
      <div className="refeicoes__cabecalho">
        <h1 className="refeicoes__titulo">Controle de Refeições</h1>
        <button className="refeicoes__botaoAdicionar">
          Registrar Refeição
        </button>
      </div>
      
      <div className="refeicoes__filtros">
        <input 
          type="date" 
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          className="refeicoes__filtroData"
        />
        <select 
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="refeicoes__filtroTipo"
        >
          <option value="">Todos os tipos</option>
          <option value="Café da Manhã">Café da Manhã</option>
          <option value="Almoço">Almoço</option>
          <option value="Lanche">Lanche</option>
          <option value="Jantar">Jantar</option>
        </select>
        <input 
          type="text" 
          placeholder="Buscar funcionário..." 
          className="refeicoes__busca"
        />
      </div>
      
      <div className="refeicoes__estatisticas">
        <div className="refeicoes__estatistica">
          <span className="refeicoes__estatisticaNumero">25</span>
          <span className="refeicoes__estatisticaLabel">Confirmadas</span>
        </div>
        <div className="refeicoes__estatistica">
          <span className="refeicoes__estatisticaNumero">5</span>
          <span className="refeicoes__estatisticaLabel">Pendentes</span>
        </div>
        <div className="refeicoes__estatistica">
          <span className="refeicoes__estatisticaNumero">2</span>
          <span className="refeicoes__estatisticaLabel">Canceladas</span>
        </div>
      </div>
      
      <div className="refeicoes__tabela">
        <table>
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {refeicoes.map(refeicao => (
              <tr key={refeicao.id}>
                <td>{refeicao.funcionario}</td>
                <td>{refeicao.tipo}</td>
                <td>{new Date(refeicao.data).toLocaleDateString('pt-BR')}</td>
                <td>{refeicao.horario}</td>
                <td>
                  <span className={`refeicoes__status ${refeicao.status.toLowerCase()}`}>
                    {refeicao.status}
                  </span>
                </td>
                <td className="refeicoes__acoes">
                  <button className="refeicoes__botaoEditar">Editar</button>
                  <button className="refeicoes__botaoCancelar">Cancelar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Refeicoes;
