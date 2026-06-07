package AssetTrack.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
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

    @CreationTimestamp
    @Column(name = "data_inicio", nullable = false, updatable = false)
    private LocalDateTime dataInicio;

    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;

    @Column(name = "status_auditoria", nullable = false, length = 50)
    private String statusAuditoria = "PENDENTE";

    @Column(name = "tipo_auditoria", nullable = false, length = 20)
    private String tipoAuditoria;

    @Column(length = 255)
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "id_usuario_auditor", nullable = false)
    private Usuario auditor;

    @ManyToOne
    @JoinColumn(name = "id_setor_auditado")
    private Setor setorAuditado;
}