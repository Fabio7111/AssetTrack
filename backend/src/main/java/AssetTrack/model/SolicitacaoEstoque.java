package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
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

    @Column(name = "quantidade_solicitada", nullable = false)
    private Integer quantidadeSolicitada;

    @CreationTimestamp
    @Column(name = "data_solicitacao", nullable = false, updatable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "status_pedido", nullable = false, length = 50)
    private String statusPedido = "ABERTA";

    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;

    @Column(length = 500)
    private String observacao;

    @ManyToOne
    @JoinColumn(name = "id_item", nullable = false)
    private ItemEstoque item;

    @ManyToOne
    @JoinColumn(name = "id_usuario_solicitante", nullable = false)
    private Usuario usuarioSolicitante;
}