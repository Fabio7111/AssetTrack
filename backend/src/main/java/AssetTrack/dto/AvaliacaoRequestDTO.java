package AssetTrack.dto;

import java.util.UUID;

public record AvaliacaoRequestDTO(
        UUID idManutencao,
        UUID idUsuarioAvaliador,
        Integer notaServico,
        String comentarios
) {}