package AssetTrack.dto;

import java.util.UUID;

public record AuditoriaRequestDTO(
        String tipoAuditoria,
        String descricao,
        UUID idSetorAuditado
) {}