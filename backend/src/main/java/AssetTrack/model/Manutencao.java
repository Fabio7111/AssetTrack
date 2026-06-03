package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "manutencao")
@Data
@NoArgsConstructor
public class Manutencao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idManutencao;

    @Column(name = "tipo_manutencao", nullable = false, length = 50)
    private String tipoManutencao;

    private LocalDateTime dataInicio;
    private LocalDateTime dataConclusao;

    @Column(name = "descricao_servico", length = 500)
    private String descricaoServico;

    @Column(name = "custo_manutencao", precision = 10, scale = 2)
    private BigDecimal custoManutencao;

    @OneToOne
    @JoinColumn(name = "id_solicitacao_manutencao", nullable = false)
    private SolicitacaoManutencao solicitacao;

    @ManyToOne
    @JoinColumn(name = "id_usuario_tecnico", nullable = false)
    private Usuario tecnico;

    @ManyToOne
    @JoinColumn(name = "id_equipamento", nullable = false)
    private Equipamento equipamento;
}