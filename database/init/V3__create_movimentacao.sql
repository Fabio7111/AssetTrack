CREATE TABLE movimentacao (
  id_movimentacao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_movimentacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  observacao VARCHAR(255),

  id_equipamento UUID NOT NULL,
  id_setor_origem UUID NOT NULL,
  id_setor_destino UUID NOT NULL,
  id_usuario_responsavel UUID NOT NULL,

  CONSTRAINT fk_movimentacao_equipamento
      FOREIGN KEY (id_equipamento)
          REFERENCES equipamento(id_equipamento),

  CONSTRAINT fk_movimentacao_setor_origem
      FOREIGN KEY (id_setor_origem)
          REFERENCES setor(id_setor),

  CONSTRAINT fk_movimentacao_setor_destino
      FOREIGN KEY (id_setor_destino)
          REFERENCES setor(id_setor),

  CONSTRAINT fk_movimentacao_usuario
      FOREIGN KEY (id_usuario_responsavel)
          REFERENCES usuario(id),

  CONSTRAINT chk_movimentacao_setores
      CHECK (id_setor_origem <> id_setor_destino)
);

CREATE INDEX idx_movimentacao_equipamento ON movimentacao(id_equipamento);
CREATE INDEX idx_movimentacao_setor_origem ON movimentacao(id_setor_origem);
CREATE INDEX idx_movimentacao_setor_destino ON movimentacao(id_setor_destino);
CREATE INDEX idx_movimentacao_data ON movimentacao(data_movimentacao);