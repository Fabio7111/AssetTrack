package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "configuracao_sistema")
public class ConfiguracaoSistema {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome_organizacao")
    private String nomeOrganizacao;

    @Column(name = "telefone")
    private String telefone;

    @Column(name = "email_suporte")
    private String emailSuporte;

    @Column(name = "alerta_baixo_estoque")
    private Boolean alertaBaixoEstoque;

    @Column(name = "alerta_devolucao_atrasada")
    private Boolean alertaDevolucaoAtrasada;
}