package AssetTrack.dto;

import java.util.UUID;

public record DescarteRequestDTO(
        UUID idEquipamento,
        UUID idUsuarioAutorizador,
        String motivoDescarte
) {}