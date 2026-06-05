package AssetTrack.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ManutencaoRequestDTO(
        UUID idEquipamento,
        UUID idTecnico,
        String tipoManutencao, // Ex: PREVENTIVA, CORRETIVA
        LocalDateTime dataInicio,
        LocalDateTime dataConclusao,
        String descricaoServico,
        BigDecimal custoManutencao
) {}