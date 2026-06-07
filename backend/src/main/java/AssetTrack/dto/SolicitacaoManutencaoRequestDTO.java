package AssetTrack.dto;

import java.util.UUID;

public record SolicitacaoManutencaoRequestDTO(
        UUID idEquipamento,
        String descricaoProblema
) {}