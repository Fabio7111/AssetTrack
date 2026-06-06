CREATE TABLE termo_responsabilidade (
    id_termo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_emissao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_devolucao TIMESTAMP,
    status_termo VARCHAR(50) NOT NULL DEFAULT 'ATIVO',

    id_usuario UUID NOT NULL,
    id_equipamento UUID NOT NULL,

    CONSTRAINT fk_termo_usuario
        FOREIGN KEY (id_usuario)
            REFERENCES usuario(id),

    CONSTRAINT fk_termo_equipamento
        FOREIGN KEY (id_equipamento)
            REFERENCES equipamento(id_equipamento)
);

CREATE TABLE descarte (
    id_descarte UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_descarte TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo_descarte VARCHAR(500) NOT NULL,

    id_equipamento UUID NOT NULL UNIQUE,
    id_usuario_autorizador UUID NOT NULL,

    CONSTRAINT fk_descarte_equipamento
      FOREIGN KEY (id_equipamento)
          REFERENCES equipamento(id_equipamento),

    CONSTRAINT fk_descarte_usuario
      FOREIGN KEY (id_usuario_autorizador)
          REFERENCES usuario(id)
);

CREATE INDEX idx_termo_usuario ON termo_responsabilidade(id_usuario);
CREATE INDEX idx_termo_equipamento ON termo_responsabilidade(id_equipamento);
CREATE INDEX idx_descarte_equipamento ON descarte(id_equipamento);
CREATE INDEX idx_descarte_data ON descarte(data_descarte);

INSERT INTO perfil_acesso (id, nome_perfil, descricao) VALUES
   (
       gen_random_uuid(),
       'USUARIO',
       'Acesso base. Permissão restrita para consulta de ativos vinculados, abertura de solicitações (requisições/manutenção) e visualização de movimentações próprias.'
   ),
   (
       gen_random_uuid(),
       'MODERADOR',
       'Acesso operacional. Permissão para gerir inventário, registrar movimentações de hardware, atualizar status de manutenção e extrair relatórios setoriais.'
   ),
   (
       gen_random_uuid(),
       'ADMINISTRADOR',
       'Acesso irrestrito (SysAdmin). Controle total sobre configurações globais, trilhas de auditoria de banco, gestão de acessos (IAM) e aprovação de aquisições.'
   );

INSERT INTO setor (id_setor, nome_setor, localizacao_fisica) VALUES
    (gen_random_uuid(), 'TI', 'Estoque'),
    (gen_random_uuid(), 'Financeiro', NULL),
    (gen_random_uuid(), 'NAAS', 'Faturamento');

ALTER TABLE manutencao ADD COLUMN status VARCHAR(30) DEFAULT 'ATIVA';

ALTER TABLE movimentacao ADD COLUMN data_inicio TIMESTAMP;
ALTER TABLE movimentacao ADD COLUMN data_conclusao TIMESTAMP;

ALTER TABLE movimentacao
    ADD COLUMN status VARCHAR(50) DEFAULT 'AGENDADO' NOT NULL;

UPDATE movimentacao
SET status = 'AGENDADO'
WHERE status IS NULL;