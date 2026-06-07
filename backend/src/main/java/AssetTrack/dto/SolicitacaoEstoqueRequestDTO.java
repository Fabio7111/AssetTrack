package AssetTrack.dto;

import java.util.UUID;

public record SolicitacaoEstoqueRequestDTO(
        UUID idItem,
        Integer quantidadeSolicitada,
        String observacao
) {}