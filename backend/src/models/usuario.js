const crypto = require('crypto');
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

function hashSenhaSHA256(senha) {
  return crypto.createHash('sha256').update(senha).digest('hex');
}

const criarUsuario = async ({ nome, email, senha, situacao = 'ativo', ativo = true }) => {
  const senhaHash = hashSenhaSHA256(senha);
  const result = await pool.query(
    `INSERT INTO usuario (uuid, nome, email, senha, situacao, ativo) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *`,
    [nome, email, senhaHash, situacao, ativo]
  );
  return result.rows[0];
};

const buscarPorEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM usuario WHERE email = $1 AND ativo = true AND deletado = false LIMIT 1`,
    [email]
  );
  return result.rows[0];
};

module.exports = {
  criarUsuario,
  buscarPorEmail,
  hashSenhaSHA256
};
