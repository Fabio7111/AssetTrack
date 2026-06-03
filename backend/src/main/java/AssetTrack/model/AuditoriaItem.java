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

    @Column(name = "foi_encontrado", nullable = false)
    private Boolean foiEncontrado;

    @Column(name = "condicao_equipamento", length = 100)
    private String condicaoEquipamento;

    @Column(length = 255)
    private String observacao;

    @ManyToOne
    @JoinColumn(name = "id_auditoria", nullable = false)
    private Auditoria auditoria;

    @ManyToOne
    @JoinColumn(name = "id_equipamento", nullable = false)
    private Equipamento equipamento;
}