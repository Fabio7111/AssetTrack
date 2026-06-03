package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "termo_responsabilidade")
@Data
@NoArgsConstructor
public class TermoResponsabilidade {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idTermo;

    @Column(name = "data_emissao", nullable = false)
    private LocalDateTime dataEmissao;

    private LocalDateTime dataDevolucao;

    @Column(name = "status_termo", nullable = false, length = 50)
    private String statusTermo;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_equipamento", nullable = false)
    private Equipamento equipamento;
}