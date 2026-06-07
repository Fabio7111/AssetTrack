package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "auditoria_item")
@Data
@NoArgsConstructor
public class AuditoriaItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idAuditoriaItem;

    @Column(name = "quantidade_contada")
    private Integer quantidadeContada;

    @Column(name = "numero_serie_contado", length = 100)
    private String numeroSerieContado;

    @Column(name = "foi_encontrado")
    private Boolean foiEncontrado;

    @Column(length = 255)
    private String observacao;

    @ManyToOne
    @JoinColumn(name = "id_auditoria", nullable = false)
    private Auditoria auditoria;

    @ManyToOne
    @JoinColumn(name = "id_equipamento")
    private Equipamento equipamento;

    @ManyToOne
    @JoinColumn(name = "id_item_estoque")
    private ItemEstoque itemEstoque;
}