package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "movimentacao_estoque")
@Data
@NoArgsConstructor
public class MovimentacaoEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idMovimentacao;

    @ManyToOne
    @JoinColumn(name = "id_item", nullable = false)
    private ItemEstoque item;

    @ManyToOne
    @JoinColumn(name = "id_unidade")
    private UnidadeEstoque unidade;

    @Column(length = 10, nullable = false)
    private String tipo;

    @Column(nullable = false)
    private Integer quantidade = 1;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_setor")
    private Setor setor;

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @CreationTimestamp
    @Column(name = "data_hora", nullable = false, updatable = false)
    private LocalDateTime dataHora;
}