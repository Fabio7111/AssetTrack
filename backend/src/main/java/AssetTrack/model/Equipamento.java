package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "equipamento")
@Data
@NoArgsConstructor
public class Equipamento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idEquipamento;

    @Column(name = "nome_equipamento", nullable = false, length = 150)
    private String nomeEquipamento;

    @Column(name = "numero_serie", length = 100)
    private String numeroSerie;

    @Column(name = "status_atual", nullable = false, length = 50)
    private String statusAtual;

    @CreationTimestamp
    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @ManyToOne
    @JoinColumn(name = "id_setor", nullable = false)
    private Setor setor;

    @OneToOne
    @JoinColumn(name = "id_aquisicao", nullable = false)
    private Aquisicao aquisicao;
}