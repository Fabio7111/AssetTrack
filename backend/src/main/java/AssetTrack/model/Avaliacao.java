package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "avaliacao")
@Data
@NoArgsConstructor
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idAvaliacao;

    @Column(name = "nota_servico", nullable = false)
    private Integer notaServico;

    @Column(length = 500)
    private String comentarios;

    @CreationTimestamp
    @Column(name = "data_avaliacao", nullable = false, updatable = false)
    private LocalDateTime dataAvaliacao;

    @ManyToOne
    @JoinColumn(name = "id_solicitacao_manutencao")
    private SolicitacaoManutencao solicitacaoManutencao;

    @ManyToOne
    @JoinColumn(name = "id_solicitacao_estoque")
    private SolicitacaoEstoque solicitacaoEstoque;

    @ManyToOne
    @JoinColumn(name = "id_usuario_avaliador", nullable = false)
    private Usuario avaliador;
}