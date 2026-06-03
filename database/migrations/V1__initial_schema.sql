-- =========================================
-- EXTENSÕES
-- =========================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- TABELA: perfil_acesso
-- =========================================

CREATE TABLE perfil_acesso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- TABELA: usuario
-- =========================================

CREATE TABLE usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',

    ultimo_login TIMESTAMP,

    perfil_acesso_id UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_perfil
        FOREIGN KEY (perfil_acesso_id)
        REFERENCES perfil_acesso(id)
);

-- =========================================
-- ÍNDICES
-- =========================================

CREATE INDEX idx_usuario_email
    ON usuario(email);

CREATE INDEX idx_usuario_status
    ON usuario(status);

CREATE INDEX idx_usuario_perfil
    ON usuario(perfil_acesso_id);