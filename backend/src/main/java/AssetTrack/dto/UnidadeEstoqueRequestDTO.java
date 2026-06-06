package AssetTrack.dto;

import java.util.UUID;

public record UnidadeEstoqueRequestDTO(
        UUID idItem,
        String patrimonio,
        String estado,
        String observacao,
        UUID idSetor,
        UUID idUsuario
) {}