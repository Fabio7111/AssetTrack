package AssetTrack.dto;

import java.util.UUID;

public record AuditoriaItemResponseDTO(
        UUID id,
        String tipo,
        String nome,
        String categoria,
        Integer quantidadeAtual,
        String numeroSerieAtual,
        String statusAtual
) {}