-- Adicionar coluna id_usuario na tabela controle_estoque
ALTER TABLE controle_estoque ADD COLUMN id_usuario INTEGER;

-- Adicionar constraint de foreign key
ALTER TABLE controle_estoque ADD CONSTRAINT fk_controle_estoque_usuario 
FOREIGN KEY (id_usuario) REFERENCES usuario(id);

-- Criar índice para melhor performance
CREATE INDEX idx_controle_estoque_usuario ON controle_estoque(id_usuario);
CREATE INDEX idx_controle_estoque_produto ON controle_estoque(id_produto);
