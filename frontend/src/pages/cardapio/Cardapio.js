import React, { useState } from 'react';
import './cardapio.scss';

const Cardapio = () => {
  const [cardapioSemanal, setCardapioSemanal] = useState({
    'segunda': {
      cafeManha: 'Pão francês, manteiga, café, leite',
      almoco: 'Arroz, feijão, frango grelhado, salada verde',
      lanche: 'Frutas da estação',
      jantar: 'Sopa de legumes, pão integral'
    },
    'terca': {
      cafeManha: 'Tapioca, queijo, café, suco natural',
      almoco: 'Arroz, feijão, carne moída, batata doce',
      lanche: 'Iogurte com granola',
      jantar: 'Sanduíche natural, suco'
    },
    'quarta': {
      cafeManha: 'Aveia, frutas, café, leite',
      almoco: 'Arroz, feijão, peixe assado, legumes refogados',
      lanche: 'Biscoitos integrais',
      jantar: 'Salada caesar, pão'
    },
    'quinta': {
      cafeManha: 'Pão integral, geleia, café, achocolatado',
      almoco: 'Arroz, feijão, bife acebolado, purê de batata',
      lanche: 'Mix de castanhas',
      jantar: 'Wrap de frango, suco'
    },
    'sexta': {
      cafeManha: 'Panqueca, mel, café, vitamina',
      almoco: 'Arroz, feijão, frango xadrez, macarrão',
      lanche: 'Bolo caseiro',
      jantar: 'Pizza margherita, refrigerante'
    }
  });

  const [semanaAtual, setSemanaAtual] = useState('15/08 - 19/08');
  const [modoEdicao, setModoEdicao] = useState(false);

  const diasSemana = [
    { key: 'segunda', nome: 'Segunda-feira' },
    { key: 'terca', nome: 'Terça-feira' },
    { key: 'quarta', nome: 'Quarta-feira' },
    { key: 'quinta', nome: 'Quinta-feira' },
    { key: 'sexta', nome: 'Sexta-feira' }
  ];

  const tiposRefeicao = [
    { key: 'cafeManha', nome: 'Café da Manhã' },
    { key: 'almoco', nome: 'Almoço' },
    { key: 'lanche', nome: 'Lanche' },
    { key: 'jantar', nome: 'Jantar' }
  ];

  return (
    <div className="cardapio">
      <div className="cardapio__cabecalho">
        <div>
          <h1 className="cardapio__titulo">Cardápio Semanal</h1>
          <span className="cardapio__semana">Semana: {semanaAtual}</span>
        </div>
        <div className="cardapio__acoes">
          <button 
            className={`cardapio__botaoEdicao ${modoEdicao ? 'ativo' : ''}`}
            onClick={() => setModoEdicao(!modoEdicao)}
          >
            {modoEdicao ? 'Salvar' : 'Editar'}
          </button>
          <button className="cardapio__botaoImprimir">
            Imprimir Cardápio
          </button>
        </div>
      </div>
      
      <div className="cardapio__navegacao">
        <button className="cardapio__botaoSemana">
          ← Semana Anterior
        </button>
        <span className="cardapio__indicadorSemana">{semanaAtual}</span>
        <button className="cardapio__botaoSemana">
          Próxima Semana →
        </button>
      </div>
      
      <div className="cardapio__grade">
        <div className="cardapio__cabecalhoGrade">
          <div className="cardapio__celulaTipo">Refeição</div>
          {diasSemana.map(dia => (
            <div key={dia.key} className="cardapio__celulaDia">
              {dia.nome}
            </div>
          ))}
        </div>
        
        {tiposRefeicao.map(tipo => (
          <div key={tipo.key} className="cardapio__linhaRefeicao">
            <div className="cardapio__tipoRefeicao">
              {tipo.nome}
            </div>
            {diasSemana.map(dia => (
              <div key={`${dia.key}-${tipo.key}`} className="cardapio__itemCardapio">
                {modoEdicao ? (
                  <textarea
                    value={cardapioSemanal[dia.key][tipo.key]}
                    onChange={(e) => {
                      setCardapioSemanal({
                        ...cardapioSemanal,
                        [dia.key]: {
                          ...cardapioSemanal[dia.key],
                          [tipo.key]: e.target.value
                        }
                      });
                    }}
                    className="cardapio__textarea"
                  />
                ) : (
                  <p className="cardapio__textoItem">
                    {cardapioSemanal[dia.key][tipo.key]}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="cardapio__observacoes">
        <h3>Observações Importantes:</h3>
        <ul>
          <li>O cardápio pode sofrer alterações sem aviso prévio</li>
          <li>Informar alergias e restrições alimentares ao RH</li>
          <li>Horários das refeições: Café (8h-9h), Almoço (12h-13h30), Lanche (15h-16h), Jantar (18h-19h)</li>
          <li>Em caso de dúvidas, procure a equipe do refeitório</li>
        </ul>
      </div>
    </div>
  );
};

export default Cardapio;
