package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "movimentacao")
@Data
@NoArgsConstructor
public class Movimentacao {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idMovimentacao;

    @Column(name = "data_movimentacao", nullable = false)
    private LocalDateTime dataMovimentacao;

    @Column(length = 255)
    private String observacao;

    @ManyToOne
    @JoinColumn(name = "id_equipamento", nullable = false)
    private Equipamento equipamento;

    @ManyToOne
    @JoinColumn(name = "id_setor_origem", nullable = false)
    private Setor setorOrigem;

    @ManyToOne
    @JoinColumn(name = "id_setor_destino", nullable = false)
    private Setor setorDestino;

    @ManyToOne
    @JoinColumn(name = "id_usuario_responsavel", nullable = false)
    private Usuario responsavel;
}