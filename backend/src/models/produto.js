const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10
});

const listarProdutos = async () => {
  const result = await pool.query('SELECT * FROM produto WHERE deletado = false ORDER BY id');
  return result.rows;
};

const criarProduto = async ({ nome, valor, quantidade_estoque, estoque_minimo = 10, quantidade = 0 }) => {
  const result = await pool.query(
    `INSERT INTO produto (uuid, nome, valor, quantidade_estoque, estoque_minimo, quantidade, ativo, deletado) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true, false) RETURNING *`,
    [nome, valor, quantidade_estoque, estoque_minimo, quantidade]
  );
  return result.rows[0];
};

const buscarProdutoPorId = async (id) => {
  const result = await pool.query('SELECT * FROM produto WHERE id = $1 AND deletado = false', [id]);
  return result.rows[0];
};

const editarProduto = async ({ id, nome, valor, quantidade_estoque, estoque_minimo, quantidade, ativo }) => {
  const result = await pool.query(
    `UPDATE produto SET nome = $1, valor = $2, quantidade_estoque = $3, estoque_minimo = $4, quantidade = $5, ativo = $6 WHERE id = $7 AND deletado = false RETURNING *`,
    [nome, valor, quantidade_estoque, estoque_minimo, quantidade, ativo, id]
  );
  return result.rows[0];
};

// Registrar movimentação de estoque
const registrarMovimentacaoEstoque = async ({ id_produto, quantidade_antes, quantidade_depois, quantidade_adicionada }) => {
  const result = await pool.query(
    `INSERT INTO controle_estoque (id_produto, quantidade, quantidade_antes, quantidade_depois, quantidade_adicionada, data_compra, ativo, deletado) 
     VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, true, false) RETURNING *`,
    [id_produto, quantidade_adicionada, quantidade_antes, quantidade_depois, quantidade_adicionada]
  );
  return result.rows[0];
};

// Atualizar estoque com base na quantidade adicionada
const atualizarEstoque = async ({ id, quantidade_caixas, quantidade_por_caixa }) => {
  // Buscar produto atual
  const produtoAtual = await buscarProdutoPorId(id);
  if (!produtoAtual) {
    throw new Error('Produto não encontrado');
  }

  const quantidade_antes = produtoAtual.quantidade_estoque;
  const quantidade_adicionar = quantidade_caixas * quantidade_por_caixa;
  const quantidade_depois = quantidade_antes + quantidade_adicionar;

  // Atualizar estoque do produto
  const result = await pool.query(
    `UPDATE produto SET quantidade_estoque = $1 WHERE id = $2 AND deletado = false RETURNING *`,
    [quantidade_depois, id]
  );

  // Registrar movimentação no controle de estoque
  const movimentacao = await registrarMovimentacaoEstoque({
    id_produto: id,
    quantidade_antes,
    quantidade_depois,
    quantidade_adicionada: quantidade_adicionar
  });

  return {
    produto: result.rows[0],
    movimentacao
  };
};

module.exports = {
  listarProdutos,
  criarProduto,
  buscarProdutoPorId,
  editarProduto,
  registrarMovimentacaoEstoque,
  atualizarEstoque
};
