package AssetTrack.dto;

import java.util.UUID;

public record AvaliacaoRequestDTO(
        UUID idSolicitacaoManutencao,
        UUID idSolicitacaoEstoque,
        Integer notaServico,
        String comentarios
) {}