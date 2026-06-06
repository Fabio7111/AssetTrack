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

    private String status;

    @Column(name = "data_inicio")
    private LocalDateTime dataInicio;

    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;

    @Column(length = 255)
    private String observacao;

    @ManyToOne
    @JoinColumn(name = "id_equipamento", nullable = false)
    private Equipamento equipamento;

    @ManyToOne
    @JoinColumn(name = "id_setor_origem", nullable = true)
    private Setor setorOrigem;

    @ManyToOne
    @JoinColumn(name = "id_setor_destino", nullable = false)
    private Setor setorDestino;

    @ManyToOne
    @JoinColumn(name = "id_usuario_responsavel", nullable = true)
    private Usuario responsavel;
}