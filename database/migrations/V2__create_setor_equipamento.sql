-- =========================================
-- TABELA: setor
-- =========================================

CREATE TABLE setor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nome VARCHAR(100) NOT NULL UNIQUE,

    localizacao_fisica VARCHAR(255),

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABELA: equipamento
-- =========================================

CREATE TABLE equipamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    patrimonio VARCHAR(50) NOT NULL UNIQUE,

    nome VARCHAR(150) NOT NULL,

    modelo VARCHAR(100),

    categoria VARCHAR(100),

    fabricante VARCHAR(100),

    numero_serie VARCHAR(100) UNIQUE,

    status VARCHAR(50) NOT NULL DEFAULT 'ATIVO',

    ultima_inspecao TIMESTAMP,

    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    setor_id UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_equipamento_setor
        FOREIGN KEY (setor_id)
        REFERENCES setor(id)
);

-- =========================================
-- ÍNDICES
-- =========================================

CREATE INDEX idx_setor_nome
    ON setor(nome);

CREATE INDEX idx_equipamento_patrimonio
    ON equipamento(patrimonio);

CREATE INDEX idx_equipamento_status
    ON equipamento(status);

CREATE INDEX idx_equipamento_categoria
    ON equipamento(categoria);

CREATE INDEX idx_equipamento_setor
    ON equipamento(setor_id);