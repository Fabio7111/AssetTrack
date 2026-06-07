package AssetTrack.dto;

import AssetTrack.model.Auditoria;
import java.time.LocalDateTime;
import java.util.UUID;

public record AuditoriaResponseDTO(
        UUID idAuditoria,
        String tipoAuditoria,
        String descricao,
        String status,
        String nomeAuditor,
        String nomeSetor,
        LocalDateTime dataInicio,
        LocalDateTime dataConclusao
) {
    public AuditoriaResponseDTO(Auditoria a) {
        this(
                a.getIdAuditoria(),
                a.getTipoAuditoria(),
                a.getDescricao(),
                a.getStatusAuditoria(),
                a.getAuditor() != null ? a.getAuditor().getNome() : null,
                a.getSetorAuditado() != null ? a.getSetorAuditado().getNomeSetor() : "Geral",
                a.getDataInicio(),
                a.getDataConclusao()
        );
    }
}