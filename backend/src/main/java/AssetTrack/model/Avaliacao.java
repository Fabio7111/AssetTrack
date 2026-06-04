package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "avaliacao")
@Data
@NoArgsConstructor
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idAvaliacao;

    @Column(name = "nota_servico", nullable = false)
    private Integer notaServico;

    @Column(length = 500)
    private String comentarios;

    @Column(name = "data_avaliacao", nullable = false)
    private LocalDateTime dataAvaliacao;

    @OneToOne
    @JoinColumn(name = "id_manutencao", nullable = false)
    private Manutencao manutencao;

    @OneToOne
    @JoinColumn(name = "id_usuario_avaliador", nullable = false)
    private Usuario avaliador;
}