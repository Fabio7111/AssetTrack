-- =========================================
-- TABELA: movimentacao
-- =========================================

CREATE TABLE movimentacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    data_movimentacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    status VARCHAR(30) NOT NULL DEFAULT 'CONCLUIDA',

    observacao VARCHAR(255),

    equipamento_id UUID NOT NULL,

    setor_origem_id UUID NOT NULL,

    setor_destino_id UUID NOT NULL,

    usuario_responsavel_id UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_movimentacao_equipamento
        FOREIGN KEY (equipamento_id)
        REFERENCES equipamento(id),

    CONSTRAINT fk_movimentacao_setor_origem
        FOREIGN KEY (setor_origem_id)
        REFERENCES setor(id),

    CONSTRAINT fk_movimentacao_setor_destino
        FOREIGN KEY (setor_destino_id)
        REFERENCES setor(id),

    CONSTRAINT fk_movimentacao_usuario
        FOREIGN KEY (usuario_responsavel_id)
        REFERENCES usuario(id),
    
    CONSTRAINT chk_movimentacao_setores
    CHECK (setor_origem_id <> setor_destino_id)
);

-- =========================================
-- ÍNDICES
-- =========================================

CREATE INDEX idx_movimentacao_equipamento
    ON movimentacao(equipamento_id);

CREATE INDEX idx_movimentacao_setor_origem
    ON movimentacao(setor_origem_id);

CREATE INDEX idx_movimentacao_setor_destino
    ON movimentacao(setor_destino_id);

CREATE INDEX idx_movimentacao_usuario
    ON movimentacao(usuario_responsavel_id);

CREATE INDEX idx_movimentacao_data
    ON movimentacao(data_movimentacao);

CREATE INDEX idx_movimentacao_status
    ON movimentacao(status);