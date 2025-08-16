-- Script para remover tabelas de auditoria e notificações
-- Execute este script no seu banco PostgreSQL

-- Remover tabelas na ordem correta (respeitando foreign keys)
DROP TABLE IF EXISTS notificacoes CASCADE;
DROP TABLE IF EXISTS auditoria CASCADE;
DROP TABLE IF EXISTS system_logs CASCADE;
DROP TABLE IF EXISTS sessoes_usuario CASCADE;

-- Remover índices se existirem separadamente
DROP INDEX IF EXISTS idx_auditoria_usuario;
DROP INDEX IF EXISTS idx_auditoria_tabela;
DROP INDEX IF EXISTS idx_auditoria_criado_em;
DROP INDEX IF EXISTS idx_notificacoes_usuario;
DROP INDEX IF EXISTS idx_notificacoes_lida;

-- Remover funções e triggers se existirem
DROP FUNCTION IF EXISTS trigger_audit_produto() CASCADE;
DROP FUNCTION IF EXISTS trigger_audit_usuario() CASCADE;
DROP FUNCTION IF EXISTS trigger_audit_controle_estoque() CASCADE;

COMMIT;

-- Verificar se as tabelas foram removidas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('auditoria', 'notificacoes', 'system_logs', 'sessoes_usuario');
