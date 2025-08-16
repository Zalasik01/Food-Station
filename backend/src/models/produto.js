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

const criarProduto = async ({ nome, valor, quantidade_estoque, estoque_minimo = 10 }) => {
  const result = await pool.query(
    `INSERT INTO produto (uuid, nome, valor, quantidade_estoque, estoque_minimo, ativo, deletado) VALUES (gen_random_uuid(), $1, $2, $3, $4, true, false) RETURNING *`,
    [nome, valor, quantidade_estoque, estoque_minimo]
  );
  return result.rows[0];
};

const buscarProdutoPorId = async (id) => {
  const result = await pool.query('SELECT id, nome, valor, quantidade_estoque, estoque_minimo, ativo FROM produto WHERE id = $1 AND deletado = false', [id]);
  return result.rows[0];
};

const editarProduto = async ({ id, nome, valor, quantidade_estoque, estoque_minimo, ativo }) => {
  const result = await pool.query(
    `UPDATE produto SET nome = $1, valor = $2, quantidade_estoque = $3, estoque_minimo = $4, ativo = $5 WHERE id = $6 AND deletado = false RETURNING *`,
    [nome, valor, quantidade_estoque, estoque_minimo, ativo, id]
  );
  return result.rows[0];
};

module.exports = {
  listarProdutos,
  criarProduto,
  buscarProdutoPorId,
  editarProduto
};
