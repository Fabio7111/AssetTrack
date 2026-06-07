package AssetTrack.dto;

import java.util.UUID;

public record AuditoriaItemRequestDTO(
        UUID idEquipamento,
        UUID idItemEstoque,
        Integer quantidadeContada,
        String numeroSerieContado,
        String observacao
) {}