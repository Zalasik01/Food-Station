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
  const result = await pool.query('SELECT id, nome, valor, quantidade_estoque FROM produto WHERE deletado = false ORDER BY id');
  return result.rows;
};

const criarProduto = async ({ nome, preco, quantidade_estoque }) => {
  const result = await pool.query(
    `INSERT INTO produto (uuid, nome, valor, quantidade_estoque, ativo, deletado) VALUES (gen_random_uuid(), $1, $2, $3, true, false) RETURNING *`,
    [nome, preco, quantidade_estoque]
  );
  return result.rows[0];
};

module.exports = {
  listarProdutos,
  criarProduto
};
