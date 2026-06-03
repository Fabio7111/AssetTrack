CREATE TABLE item_estoque (
    id_item UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_item VARCHAR(150) NOT NULL,
    categoria VARCHAR(50),
    quantidade_disponivel INT NOT NULL DEFAULT 0
);

CREATE TABLE solicitacao_estoque (
    id_solicitacao_estoque UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status_pedido VARCHAR(50) NOT NULL DEFAULT 'PENDENTE',
    quantidade_solicitada INT NOT NULL,
    data_solicitacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    id_usuario_solicitante UUID NOT NULL,
    id_item UUID NOT NULL,

    CONSTRAINT fk_solicitacao_estoque_usuario
     FOREIGN KEY (id_usuario_solicitante)
         REFERENCES usuario(id),

    CONSTRAINT fk_solicitacao_estoque_item
     FOREIGN KEY (id_item)
         REFERENCES item_estoque(id_item)
);

CREATE TABLE auditoria (
   id_auditoria UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   data_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   data_conclusao TIMESTAMP,
   status_auditoria VARCHAR(50) NOT NULL DEFAULT 'EM ANDAMENTO',

   id_usuario_auditor UUID NOT NULL,
   id_setor_auditado UUID NOT NULL,

   CONSTRAINT fk_auditoria_usuario
       FOREIGN KEY (id_usuario_auditor)
           REFERENCES usuario(id),

   CONSTRAINT fk_auditoria_setor
       FOREIGN KEY (id_setor_auditado)
           REFERENCES setor(id_setor)
);

CREATE TABLE auditoria_item (
    id_auditoria_item UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    foi_encontrado BOOLEAN NOT NULL DEFAULT FALSE,
    condicao_equipamento VARCHAR(100),
    observacao VARCHAR(255),

    id_auditoria UUID NOT NULL,
    id_equipamento UUID NOT NULL,

    CONSTRAINT fk_auditoria_item_auditoria
        FOREIGN KEY (id_auditoria)
            REFERENCES auditoria(id_auditoria),

    CONSTRAINT fk_auditoria_item_equipamento
        FOREIGN KEY (id_equipamento)
            REFERENCES equipamento(id_equipamento)
);

CREATE INDEX idx_solicitacao_estoque_item ON solicitacao_estoque(id_item);
CREATE INDEX idx_solicitacao_estoque_usuario ON solicitacao_estoque(id_usuario_solicitante);
CREATE INDEX idx_auditoria_setor ON auditoria(id_setor_auditado);
CREATE INDEX idx_auditoria_auditor ON auditoria(id_usuario_auditor);
CREATE INDEX idx_auditoria_item_auditoria ON auditoria_item(id_auditoria);
CREATE INDEX idx_auditoria_item_equipamento ON auditoria_item(id_equipamento);