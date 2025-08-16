const winston = require('winston');
const path = require('path');

// Configuração do logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'food-station-api' },
  transports: [
    // Log de erros
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Log combinado
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Log de auditoria
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/audit.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 10
    })
  ]
});

// Se não estiver em produção, log também no console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Função para log de auditoria
const auditLog = (action, userId, details = {}) => {
  logger.info({
    type: 'AUDIT',
    action,
    userId,
    details,
    timestamp: new Date().toISOString()
  });
};

// Função para log de erro
const errorLog = (error, context = {}) => {
  logger.error({
    type: 'ERROR',
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
};

// Função para log de ação do usuário
const userActionLog = (action, userId, details = {}) => {
  logger.info({
    type: 'USER_ACTION',
    action,
    userId,
    details,
    timestamp: new Date().toISOString()
  });
};

// Middleware para logging de requisições
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      type: 'REQUEST',
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
};

module.exports = {
  logger,
  auditLog,
  errorLog,
  userActionLog,
  requestLogger
};
