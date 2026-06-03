CREATE TABLE setor (
   id_setor UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   nome_setor VARCHAR(100) NOT NULL,
   localizacao_fisica VARCHAR(255)
);

CREATE TABLE aquisicao (
   id_aquisicao UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   fornecedor VARCHAR(150) NOT NULL,
   data_compra DATE NOT NULL,
   numero_nota_fiscal VARCHAR(50),
   valor_total DECIMAL(10,2)
);

CREATE TABLE equipamento (
     id_equipamento UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     nome_equipamento VARCHAR(150) NOT NULL,
     numero_serie VARCHAR(100),
     status_atual VARCHAR(50) NOT NULL,
     data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     id_setor UUID NOT NULL,
     id_aquisicao UUID NOT NULL,

     CONSTRAINT fk_equipamento_setor
         FOREIGN KEY (id_setor)
             REFERENCES setor(id_setor),

     CONSTRAINT fk_equipamento_aquisicao
         FOREIGN KEY (id_aquisicao)
             REFERENCES aquisicao(id_aquisicao)
);

CREATE INDEX idx_equipamento_setor ON equipamento(id_setor);
CREATE INDEX idx_equipamento_aquisicao ON equipamento(id_aquisicao);
CREATE INDEX idx_setor_nome ON setor(nome_setor);