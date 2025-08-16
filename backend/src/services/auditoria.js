const { Pool } = require('pg');
const { auditLog } = require('../utils/logger');
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



// Registrar auditoria
const registrarAuditoria = async ({ usuarioId, acao, tabela, registroId, dadosAnteriores = null, dadosNovos = null, ip, userAgent }) => {
  try {
    const query = `
      INSERT INTO auditoria (usuario_id, acao, tabela, registro_id, dados_anteriores, dados_novos, ip_address, user_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    
    const result = await pool.query(query, [
      usuarioId,
      acao,
      tabela,
      registroId,
      dadosAnteriores ? JSON.stringify(dadosAnteriores) : null,
      dadosNovos ? JSON.stringify(dadosNovos) : null,
      ip,
      userAgent
    ]);
    
    // Log também no winston
    auditLog(acao, usuarioId, {
      tabela,
      registroId,
      dadosAnteriores,
      dadosNovos,
      ip,
      userAgent
    });
    
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error);
    throw error;
  }
};

// Criar notificação
const criarNotificacao = async ({ usuarioId, tipo, titulo, mensagem }) => {
  try {
    const query = `
      INSERT INTO notificacoes (usuario_id, tipo, titulo, mensagem)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [usuarioId, tipo, titulo, mensagem]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    throw error;
  }
};

// Verificar estoque baixo usando estoque_minimo específico de cada produto
const verificarEstoqueBaixo = async () => {
  try {
    const query = `
      SELECT p.id, p.nome, p.quantidade_estoque, p.estoque_minimo 
      FROM produto p 
      WHERE p.quantidade_estoque <= COALESCE(p.estoque_minimo, 10) 
        AND p.ativo = true 
        AND p.deletado = false
    `;
    
    const result = await pool.query(query);
    
    if (result.rows.length > 0) {
      // Buscar administradores
      const adminsQuery = `
        SELECT id FROM usuario 
        WHERE administrador = true AND ativo = true AND deletado = false
      `;
      const admins = await pool.query(adminsQuery);
      
      // Criar notificação para cada admin
      for (const produto of result.rows) {
        for (const admin of admins.rows) {
          await criarNotificacao({
            usuarioId: admin.id,
            tipo: 'ESTOQUE_BAIXO',
            titulo: 'Alerta: Estoque Baixo',
            mensagem: `O produto "${produto.nome}" está com estoque baixo (${produto.quantidade_estoque} unidades). Estoque mínimo: ${produto.estoque_minimo || 10}. Considere repor o estoque.`
          });
        }
      }
    }
    
    return result.rows;
  } catch (error) {
    console.error('Erro ao verificar estoque baixo:', error);
    throw error;
  }
};

// Listar histórico de auditoria
const listarAuditoria = async (filtros = {}) => {
  try {
    let query = `
      SELECT a.*, u.nome as usuario_nome, u.email as usuario_email
      FROM auditoria a
      LEFT JOIN usuario u ON a.usuario_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (filtros.usuarioId) {
      query += ` AND a.usuario_id = $${paramCount}`;
      params.push(filtros.usuarioId);
      paramCount++;
    }
    
    if (filtros.tabela) {
      query += ` AND a.tabela = $${paramCount}`;
      params.push(filtros.tabela);
      paramCount++;
    }
    
    if (filtros.dataInicio) {
      query += ` AND a.criado_em >= $${paramCount}`;
      params.push(filtros.dataInicio);
      paramCount++;
    }
    
    if (filtros.dataFim) {
      query += ` AND a.criado_em <= $${paramCount}`;
      params.push(filtros.dataFim);
      paramCount++;
    }
    
    query += ` ORDER BY a.criado_em DESC`;
    
    if (filtros.limit) {
      query += ` LIMIT $${paramCount}`;
      params.push(filtros.limit);
    }
    
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Erro ao listar auditoria:', error);
    throw error;
  }
};

// Listar notificações do usuário
const listarNotificacoes = async (usuarioId, limit = 20) => {
  try {
    const query = `
      SELECT * FROM notificacoes 
      WHERE usuario_id = $1 
      ORDER BY criado_em DESC 
      LIMIT $2
    `;
    
    const result = await pool.query(query, [usuarioId, limit]);
    return result.rows;
  } catch (error) {
    console.error('Erro ao listar notificações:', error);
    throw error;
  }
};

// Marcar notificação como lida
const marcarNotificacaoLida = async (notificacaoId, usuarioId) => {
  try {
    const query = `
      UPDATE notificacoes 
      SET lida = true, data_leitura = NOW() 
      WHERE id = $1 AND usuario_id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [notificacaoId, usuarioId]);
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    throw error;
  }
};

module.exports = {
  registrarAuditoria,
  criarNotificacao,
  verificarEstoqueBaixo,
  listarAuditoria,
  listarNotificacoes,
  marcarNotificacaoLida
};
