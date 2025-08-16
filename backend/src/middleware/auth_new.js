const jwt = require('jsonwebtoken');
const config = require('../config');
const { logger } = require('../utils/logger');
const { registrarAuditoria } = require('../services/auditoria');

// Cache de tokens revogados (em produção, usar Redis)
const revokedTokens = new Set();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Tentativa de acesso sem token', { 
      ip: req.ip, 
      userAgent: req.get('User-Agent'),
      path: req.path 
    });
    return res.status(401).json({ 
      error: 'Token de acesso requerido',
      code: 'NO_TOKEN'
    });
  }

  // Verificar se o token foi revogado
  if (revokedTokens.has(token)) {
    logger.warn('Tentativa de uso de token revogado', { 
      ip: req.ip, 
      userAgent: req.get('User-Agent'),
      path: req.path 
    });
    return res.status(401).json({ 
      error: 'Token revogado',
      code: 'REVOKED_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Verificar se o token não expirou
    if (decoded.exp < Date.now() / 1000) {
      logger.warn('Token expirado usado', { 
        userId: decoded.userId,
        ip: req.ip,
        path: req.path 
      });
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'EXPIRED_TOKEN'
      });
    }

    // Adicionar informações do usuário à requisição
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      nome: decoded.nome,
      tipo: decoded.tipo,
      administrador: decoded.administrador || false
    };

    // Log de acesso autorizado
    logger.info('Acesso autorizado', {
      userId: req.user.id,
      email: req.user.email,
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    // Registrar auditoria para operações sensíveis
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      await registrarAuditoria(
        req.user.id,
        'acesso_autorizado',
        `${req.method} ${req.path}`,
        { ip: req.ip, userAgent: req.get('User-Agent') },
        null
      );
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expirado', { 
        ip: req.ip,
        path: req.path,
        error: error.message 
      });
      return res.status(401).json({ 
        error: 'Token expirado',
        code: 'EXPIRED_TOKEN'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      logger.warn('Token inválido', { 
        ip: req.ip,
        path: req.path,
        error: error.message 
      });
      return res.status(401).json({ 
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }

    logger.error('Erro na autenticação', { 
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      path: req.path 
    });
    
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Middleware para verificar se é admin (mantém compatibilidade)
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      sucesso: false,
      error: 'Usuário não autenticado'
    });
  }

  if (!req.user.administrador) {
    logger.warn('Acesso de admin negado', {
      userId: req.user.id,
      email: req.user.email,
      path: req.path,
      ip: req.ip
    });
    
    return res.status(403).json({
      sucesso: false,
      error: 'Acesso negado. Privilégios de administrador necessários.'
    });
  }
  next();
};

// Middleware para verificar permissões específicas
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuário não autenticado',
        code: 'NOT_AUTHENTICATED'
      });
    }

    if (!allowedRoles.includes(req.user.tipo)) {
      logger.warn('Acesso negado por falta de permissão', {
        userId: req.user.id,
        userRole: req.user.tipo,
        requiredRoles: allowedRoles,
        path: req.path,
        ip: req.ip
      });

      return res.status(403).json({ 
        error: 'Acesso negado. Permissões insuficientes.',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: req.user.tipo
      });
    }

    next();
  };
};

// Middleware para logging de ações (mantém compatibilidade)
const logAction = (action) => {
  return (req, res, next) => {
    req.actionLog = {
      action,
      userId: req.user?.id,
      userEmail: req.user?.email,
      timestamp: new Date(),
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };
    
    logger.info('Ação registrada', {
      action,
      userId: req.user?.id,
      userEmail: req.user?.email,
      ip: req.ip,
      path: req.path
    });
    
    next();
  };
};

// Função para revogar token
const revokeToken = (token) => {
  revokedTokens.add(token);
  logger.info('Token revogado', { token: token.substring(0, 20) + '...' });
};

// Função para limpar tokens expirados do cache
const cleanExpiredTokens = () => {
  // Esta função deve ser chamada periodicamente
  // Em produção, usar Redis com TTL automático
  revokedTokens.clear();
  logger.info('Cache de tokens revogados limpo');
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireRole,
  logAction,
  revokeToken,
  cleanExpiredTokens
};
