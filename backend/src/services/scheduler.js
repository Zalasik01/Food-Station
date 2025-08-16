const cron = require('node-cron');
const { verificarEstoqueBaixo } = require('./auditoria');
const { logger } = require('../utils/logger');

class Scheduler {
  constructor() {
    this.tasks = [];
  }

  // Inicializar todas as tarefas automáticas
  inicializar() {
    // Verificar estoque baixo todos os dias às 9h
    const taskEstoque = cron.schedule('0 9 * * *', async () => {
      try {
        logger.info('Iniciando verificação automática de estoque baixo');
        const produtosBaixos = await verificarEstoqueBaixo();
        logger.info(`Verificação de estoque concluída. ${produtosBaixos.length} produtos com estoque baixo encontrados`);
      } catch (error) {
        logger.error('Erro na verificação automática de estoque:', error);
      }
    }, {
      scheduled: false,
      timezone: "America/Sao_Paulo"
    });

    // Limpeza de logs antigos - toda segunda às 2h
    const taskLimpezaLogs = cron.schedule('0 2 * * 1', async () => {
      try {
        logger.info('Iniciando limpeza de logs antigos');
        await this.limparLogsAntigos();
        logger.info('Limpeza de logs concluída');
      } catch (error) {
        logger.error('Erro na limpeza de logs:', error);
      }
    }, {
      scheduled: false,
      timezone: "America/Sao_Paulo"
    });

    // Limpeza de notificações lidas antigas - todo dia às 3h
    const taskLimpezaNotificacoes = cron.schedule('0 3 * * *', async () => {
      try {
        logger.info('Iniciando limpeza de notificações antigas');
        await this.limparNotificacaoesAntigas();
        logger.info('Limpeza de notificações concluída');
      } catch (error) {
        logger.error('Erro na limpeza de notificações:', error);
      }
    }, {
      scheduled: false,
      timezone: "America/Sao_Paulo"
    });

    this.tasks = [taskEstoque, taskLimpezaLogs, taskLimpezaNotificacoes];
    logger.info('Scheduler inicializado com sucesso');
  }

  // Iniciar todas as tarefas
  start() {
    this.tasks.forEach(task => task.start());
    logger.info('Todas as tarefas automáticas foram iniciadas');
  }

  // Parar todas as tarefas
  stop() {
    this.tasks.forEach(task => task.stop());
    logger.info('Todas as tarefas automáticas foram paradas');
  }

  // Limpeza de logs antigos (mais de 90 dias)
  async limparLogsAntigos() {
    const { Pool } = require('pg');
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    try {
      const result = await pool.query(`
        DELETE FROM auditoria 
        WHERE criado_em < NOW() - INTERVAL '90 days'
      `);
      logger.info(`${result.rowCount} registros de auditoria antigos removidos`);
    } catch (error) {
      logger.error('Erro ao limpar logs antigos:', error);
    } finally {
      await pool.end();
    }
  }

  // Limpeza de notificações lidas antigas (mais de 30 dias)
  async limparNotificacaoesAntigas() {
    const { Pool } = require('pg');
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    try {
      const result = await pool.query(`
        DELETE FROM notificacoes 
        WHERE lida = true 
          AND data_leitura < NOW() - INTERVAL '30 days'
      `);
      logger.info(`${result.rowCount} notificações antigas removidas`);
    } catch (error) {
      logger.error('Erro ao limpar notificações antigas:', error);
    } finally {
      await pool.end();
    }
  }

  // Executar verificação de estoque manualmente
  async executarVerificacaoEstoque() {
    try {
      logger.info('Executando verificação manual de estoque');
      const produtosBaixos = await verificarEstoqueBaixo();
      return produtosBaixos;
    } catch (error) {
      logger.error('Erro na verificação manual de estoque:', error);
      throw error;
    }
  }
}

module.exports = new Scheduler();
