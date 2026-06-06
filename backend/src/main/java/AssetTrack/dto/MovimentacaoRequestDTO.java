package AssetTrack.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record MovimentacaoRequestDTO(
        UUID idEquipamento,
        UUID idSetorOrigem,
        UUID idSetorDestino,
        UUID idUsuarioResponsavel,
        LocalDateTime dataInicio,
        LocalDateTime dataConclusao,
        String observacao,
        String status
) {}