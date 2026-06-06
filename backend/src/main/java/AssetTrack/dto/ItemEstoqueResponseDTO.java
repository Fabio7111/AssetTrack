package AssetTrack.dto;

import AssetTrack.model.ItemEstoque;
import java.util.UUID;

public record ItemEstoqueResponseDTO(
        UUID idItem,
        String nomeItem,
        String categoria,
        Integer quantidadeDisponivel,
        String localizacao,
        String status,
        String imagemBase64
) {
    public ItemEstoqueResponseDTO(ItemEstoque item) {
        this(
                item.getIdItem(),
                item.getNomeItem(),
                item.getCategoria(),
                item.getQuantidadeDisponivel(),
                item.getLocalizacao(),
                item.getStatus(),
                item.getImagemBase64()
        );
    }
}