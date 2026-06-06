package AssetTrack.dto;

import java.util.UUID;

public record MovimentacaoEstoqueRequestDTO(
        UUID idItem,
        UUID idUnidade,
        String tipo,
        Integer quantidade,
        UUID idSetor,
        String observacao
) {}