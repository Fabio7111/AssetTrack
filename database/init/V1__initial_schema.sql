CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE perfil_acesso (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   nome_perfil VARCHAR(50) NOT NULL UNIQUE,
   descricao VARCHAR(255)
);

CREATE TABLE usuario (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     nome VARCHAR(150) NOT NULL,
     email VARCHAR(150) NOT NULL UNIQUE,
     senha_hash VARCHAR(255) NOT NULL,
     status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
     id_perfil UUID NOT NULL,
     CONSTRAINT fk_usuario_perfil
         FOREIGN KEY (id_perfil)
             REFERENCES perfil_acesso(id)
);

CREATE TABLE log_acesso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    acao_realizada VARCHAR(255) NOT NULL,
    id_usuario UUID NOT NULL,
    CONSTRAINT fk_log_usuario
        FOREIGN KEY (id_usuario)
            REFERENCES usuario(id)
);


CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_perfil ON usuario(id_perfil);
CREATE INDEX idx_log_usuario ON log_acesso(id_usuario);
CREATE INDEX idx_log_data ON log_acesso(data_hora);