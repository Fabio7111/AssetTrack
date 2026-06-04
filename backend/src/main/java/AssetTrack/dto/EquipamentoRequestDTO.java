package AssetTrack.dto;

import java.util.UUID;

public record EquipamentoRequestDTO(
        String nomeEquipamento,
        String numeroSerie,
        UUID idSetor,
        UUID idAquisicao
) {}