package AssetTrack.dto;

import java.util.UUID;

public record SolicitacaoRequestDTO(
        UUID idEquipamento,
        UUID idUsuarioSolicitante,
        String descricaoProblema
) {}