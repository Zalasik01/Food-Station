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

const listarEntradasPorProduto = async (id_produto) => {
  const result = await pool.query(
    `SELECT ce.*, u.nome as usuario_nome 
     FROM controle_estoque ce 
     LEFT JOIN usuario u ON ce.id_usuario = u.id 
     WHERE ce.id_produto = $1 AND ce.deletado = false 
     ORDER BY ce.data_compra DESC`,
    [id_produto]
  );
  return result.rows;
};

const registrarEntrada = async ({ id_produto, quantidade, data_compra, id_usuario }) => {
  const result = await pool.query(
    `INSERT INTO controle_estoque (uuid, id_produto, quantidade, data_compra, id_usuario, ativo, deletado, criado_em, atualizado_em)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, true, false, NOW(), NOW()) RETURNING *`,
    [id_produto, quantidade, data_compra, id_usuario]
  );
  return result.rows[0];
};

const editarMovimentacao = async ({ id, quantidade, data_compra, id_usuario }) => {
  const result = await pool.query(
    `UPDATE controle_estoque SET quantidade = $1, data_compra = $2, id_usuario = $3, atualizado_em = NOW() WHERE id = $4 AND deletado = false RETURNING *`,
    [quantidade, data_compra, id_usuario, id]
  );
  return result.rows[0];
};

const excluirMovimentacao = async (id) => {
  const result = await pool.query(
    `UPDATE controle_estoque SET deletado = true WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rows.length > 0;
};

module.exports = {
  listarEntradasPorProduto,
  registrarEntrada,
  editarMovimentacao,
  excluirMovimentacao
};
