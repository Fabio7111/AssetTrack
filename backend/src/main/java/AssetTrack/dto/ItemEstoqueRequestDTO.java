package AssetTrack.dto;

public record ItemEstoqueRequestDTO(
        String nomeItem,
        String categoria,
        Integer quantidadeDisponivel,
        String localizacao,
        String status,
        String imagemBase64
) {}