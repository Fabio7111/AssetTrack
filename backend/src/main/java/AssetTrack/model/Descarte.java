package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "descarte")
@Data
@NoArgsConstructor
public class Descarte {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idDescarte;

    @Column(name = "data_descarte", nullable = false)
    private LocalDateTime dataDescarte;

    @Column(name = "motivo_descarte", nullable = false, length = 500)
    private String motivoDescarte;

    @ManyToOne
    @JoinColumn(name = "id_equipamento", nullable = false)
    private Equipamento equipamento;

    @ManyToOne
    @JoinColumn(name = "id_usuario_autorizador", nullable = false)
    private Usuario autorizador;
}