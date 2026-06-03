package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "solicitacao_estoque")
@Data
@NoArgsConstructor
public class SolicitacaoEstoque {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idSolicitacaoEstoque;

    @Column(nullable = false)
    private Integer quantidade_solicitada;

    @Column(name = "data_solicitacao", nullable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "status_pedido", nullable = false, length = 50)
    private String statusPedido;

    @ManyToOne
    @JoinColumn(name = "id_item", nullable = false)
    private ItemEstoque item;

    @ManyToOne
    @JoinColumn(name = "id_usuario_solicitante", nullable = false)
    private Usuario usuarioSolicitante;
}