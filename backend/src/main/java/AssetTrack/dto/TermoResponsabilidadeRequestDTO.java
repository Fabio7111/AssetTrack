package AssetTrack.dto;

import java.util.UUID;

public record TermoResponsabilidadeRequestDTO(
        UUID idEquipamento,
        UUID idUsuario
) {}