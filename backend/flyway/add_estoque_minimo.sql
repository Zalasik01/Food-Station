-- Adicionar coluna estoque_minimo na tabela produto
-- Execute este script no seu banco PostgreSQL

-- Adicionar coluna estoque_minimo se não existir
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE produto ADD COLUMN estoque_minimo INTEGER DEFAULT 10;
    EXCEPTION
        WHEN duplicate_column THEN 
            RAISE NOTICE 'Coluna estoque_minimo já existe na tabela produto';
    END;
END $$;

-- Atualizar produtos existentes que não têm estoque_minimo definido
UPDATE produto 
SET estoque_minimo = 10 
WHERE estoque_minimo IS NULL;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'produto' AND column_name = 'estoque_minimo';
