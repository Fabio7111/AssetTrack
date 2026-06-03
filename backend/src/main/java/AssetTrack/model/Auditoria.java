package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "auditoria")
@Data
@NoArgsConstructor
public class Auditoria {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idAuditoria;

    @Column(name = "data_inicio", nullable = false)
    private LocalDateTime dataInicio;

    private LocalDateTime dataConclusao;

    @Column(name = "status_auditoria", nullable = false, length = 50)
    private String statusAuditoria;

    @ManyToOne
    @JoinColumn(name = "id_usuario_auditor", nullable = false)
    private Usuario auditor;

    @ManyToOne
    @JoinColumn(name = "id_setor_auditado", nullable = false)
    private Setor setorAuditado;
}