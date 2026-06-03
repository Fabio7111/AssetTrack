CREATE TABLE solicitacao_manutencao (
    id_solicitacao_manutencao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_abertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descricao_problema VARCHAR(500) NOT NULL,
    status_solicitacao VARCHAR(50) NOT NULL DEFAULT 'ABERTA',

    id_usuario_solicitante UUID NOT NULL,
    id_equipamento UUID NOT NULL,

    CONSTRAINT fk_solicitacao_usuario
        FOREIGN KEY (id_usuario_solicitante)
            REFERENCES usuario(id),

    CONSTRAINT fk_solicitacao_equipamento
        FOREIGN KEY (id_equipamento)
            REFERENCES equipamento(id_equipamento)
);

CREATE TABLE manutencao (
    id_manutencao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_manutencao VARCHAR(50) NOT NULL,
    data_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    descricao_servico VARCHAR(500),
    custo_manutencao DECIMAL(10,2),

    id_solicitacao_manutencao UUID,
    id_usuario_tecnico UUID NOT NULL,
    id_equipamento UUID NOT NULL,

    CONSTRAINT fk_manutencao_solicitacao
        FOREIGN KEY (id_solicitacao_manutencao)
            REFERENCES solicitacao_manutencao(id_solicitacao_manutencao),

    CONSTRAINT fk_manutencao_tecnico
        FOREIGN KEY (id_usuario_tecnico)
            REFERENCES usuario(id),

    CONSTRAINT fk_manutencao_equipamento
        FOREIGN KEY (id_equipamento)
            REFERENCES equipamento(id_equipamento)
);

CREATE TABLE avaliacao (
   id_avaliacao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   nota_servico INT NOT NULL,
   comentarios VARCHAR(500),
   data_avaliacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

   id_manutencao UUID NOT NULL,
   id_usuario_avaliador UUID NOT NULL,

   CONSTRAINT fk_avaliacao_manutencao
       FOREIGN KEY (id_manutencao)
           REFERENCES manutencao(id_manutencao),

   CONSTRAINT fk_avaliacao_usuario
       FOREIGN KEY (id_usuario_avaliador)
           REFERENCES usuario(id),

   CONSTRAINT chk_avaliacao_nota
       CHECK (nota_servico BETWEEN 1 AND 5)
);

CREATE INDEX idx_solicitacao_equipamento ON solicitacao_manutencao(id_equipamento);
CREATE INDEX idx_solicitacao_status ON solicitacao_manutencao(status_solicitacao);
CREATE INDEX idx_manutencao_equipamento ON manutencao(id_equipamento);
CREATE INDEX idx_manutencao_tecnico ON manutencao(id_usuario_tecnico);
CREATE INDEX idx_avaliacao_manutencao ON avaliacao(id_manutencao);