package AssetTrack.dto;

import java.util.UUID;

public record MovimentacaoRequestDTO(
        UUID idEquipamento,
        UUID idSetorDestino,
        UUID idUsuarioResponsavel,
        String observacao
) {}