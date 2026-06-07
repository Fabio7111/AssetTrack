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

ALTER TABLE equipamento ALTER COLUMN id_aquisicao DROP NOT NULL;

CREATE TABLE configuracao_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_organizacao VARCHAR(255) NOT NULL,
  fuso_horario VARCHAR(100) NOT NULL,
  email_suporte VARCHAR(255) NOT NULL,
  alerta_baixo_estoque BOOLEAN DEFAULT TRUE,
  alerta_devolucao_atrasada BOOLEAN DEFAULT TRUE
);

INSERT INTO configuracao_sistema (
    id,
    nome_organizacao,
    telefone,
    email_suporte,
    alerta_baixo_estoque,
    alerta_devolucao_atrasada
)
VALUES (
   gen_random_uuid(),
   'Unimed Assis',
   '(18) 3302-3000',
   'ti@unimedassis.exemplo.com',
   true,
   true
       );

ALTER TABLE item_estoque
    ADD COLUMN IF NOT EXISTS localizacao    VARCHAR(100),
    ADD COLUMN IF NOT EXISTS status         VARCHAR(30) NOT NULL DEFAULT 'DISPONIVEL',
    ADD COLUMN IF NOT EXISTS imagem_base64  TEXT;

CREATE TABLE unidade_estoque (
    id_unidade      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_item         UUID NOT NULL REFERENCES item_estoque(id_item) ON DELETE CASCADE,
    patrimonio      VARCHAR(100),
    estado          VARCHAR(30) NOT NULL DEFAULT 'DISPONIVEL',
    observacao      TEXT,
    id_setor        UUID REFERENCES setor(id_setor),
    id_usuario      UUID REFERENCES usuario(id)
);

CREATE TABLE movimentacao_estoque (
    id_movimentacao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_item         UUID NOT NULL REFERENCES item_estoque(id_item),
    id_unidade      UUID REFERENCES unidade_estoque(id_unidade),
    tipo            VARCHAR(10) NOT NULL, -- ENTRADA | SAIDA
    quantidade      INT NOT NULL DEFAULT 1,
    id_usuario      UUID REFERENCES usuario(id),
    id_setor        UUID REFERENCES setor(id_setor),
    observacao      TEXT,
    data_hora       TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE solicitacao_manutencao
    ADD COLUMN IF NOT EXISTS data_conclusao TIMESTAMP;

ALTER TABLE solicitacao_estoque
    ADD COLUMN IF NOT EXISTS data_conclusao TIMESTAMP,
    ADD COLUMN IF NOT EXISTS observacao     VARCHAR(500);

ALTER TABLE avaliacao
    ADD COLUMN IF NOT EXISTS id_solicitacao_manutencao UUID REFERENCES solicitacao_manutencao(id_solicitacao_manutencao),
    ADD COLUMN IF NOT EXISTS id_solicitacao_estoque    UUID REFERENCES solicitacao_estoque(id_solicitacao_estoque);

ALTER TABLE avaliacao ALTER COLUMN id_manutencao DROP NOT NULL;