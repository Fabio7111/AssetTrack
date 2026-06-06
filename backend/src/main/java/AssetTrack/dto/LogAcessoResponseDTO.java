package AssetTrack.dto;

import AssetTrack.model.LogAcesso;
import java.time.LocalDateTime;
import java.util.UUID;

public record LogAcessoResponseDTO(
        UUID id,
        LocalDateTime dataHora,
        String acaoRealizada
) {
    public LogAcessoResponseDTO(LogAcesso log) {
        this(log.getId(), log.getDataHora(), log.getAcaoRealizada());
    }
}