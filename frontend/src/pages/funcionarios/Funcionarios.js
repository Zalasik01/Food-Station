import React, { useState } from 'react';
import './funcionarios.scss';

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([
    { id: 1, nome: 'João Silva', cargo: 'Desenvolvedor', setor: 'TI', ativo: true },
    { id: 2, nome: 'Maria Santos', cargo: 'Analista', setor: 'RH', ativo: true },
    { id: 3, nome: 'Pedro Costa', cargo: 'Gerente', setor: 'Vendas', ativo: false },
  ]);

  return (
    <div className="funcionarios">
      <div className="funcionarios__cabecalho">
        <h1 className="funcionarios__titulo">Gestão de Funcionários</h1>
        <button className="funcionarios__botaoAdicionar">
          Adicionar Funcionário
        </button>
      </div>
      
      <div className="funcionarios__filtros">
        <input 
          type="text" 
          placeholder="Buscar funcionário..." 
          className="funcionarios__busca"
        />
        <select className="funcionarios__filtroSetor">
          <option value="">Todos os setores</option>
          <option value="TI">TI</option>
          <option value="RH">RH</option>
          <option value="Vendas">Vendas</option>
        </select>
      </div>
      
      <div className="funcionarios__tabela">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Setor</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.map(funcionario => (
              <tr key={funcionario.id}>
                <td>{funcionario.nome}</td>
                <td>{funcionario.cargo}</td>
                <td>{funcionario.setor}</td>
                <td>
                  <span className={`funcionarios__status ${funcionario.ativo ? 'ativo' : 'inativo'}`}>
                    {funcionario.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="funcionarios__acoes">
                  <button className="funcionarios__botaoEditar">Editar</button>
                  <button className="funcionarios__botaoExcluir">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Funcionarios;
