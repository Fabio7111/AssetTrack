package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "solicitacao_manutencao")
@Data
@NoArgsConstructor
public class SolicitacaoManutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idSolicitacaoManutencao;

    @CreationTimestamp
    @Column(name = "data_abertura", nullable = false, updatable = false)
    private LocalDateTime dataAbertura;

    @Column(name = "descricao_problema", nullable = false, length = 500)
    private String descricaoProblema;

    @Column(name = "status_solicitacao", nullable = false, length = 50)
    private String statusSolicitacao = "ABERTA";

    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;

    @ManyToOne
    @JoinColumn(name = "id_usuario_solicitante", nullable = false)
    private Usuario usuarioSolicitante;

    @ManyToOne
    @JoinColumn(name = "id_equipamento", nullable = false)
    private Equipamento equipamento;
}