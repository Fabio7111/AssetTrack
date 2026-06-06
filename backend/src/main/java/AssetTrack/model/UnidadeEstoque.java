package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "unidade_estoque")
@Data
@NoArgsConstructor
public class UnidadeEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idUnidade;

    @ManyToOne
    @JoinColumn(name = "id_item", nullable = false)
    private ItemEstoque item;

    @Column(length = 100)
    private String patrimonio;

    @Column(length = 30, nullable = false)
    private String estado = "DISPONIVEL";

    @Column(columnDefinition = "TEXT")
    private String observacao;

    @ManyToOne
    @JoinColumn(name = "id_setor")
    private Setor setor;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;
}