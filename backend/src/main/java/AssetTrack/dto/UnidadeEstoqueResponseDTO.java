package AssetTrack.dto;

import AssetTrack.model.UnidadeEstoque;
import java.util.UUID;

public record UnidadeEstoqueResponseDTO(
        UUID idUnidade,
        UUID idItem,
        String nomeItem,
        String patrimonio,
        String estado,
        String observacao,
        String nomeSetor,
        String nomeUsuario
) {
    public UnidadeEstoqueResponseDTO(UnidadeEstoque u) {
        this(
                u.getIdUnidade(),
                u.getItem().getIdItem(),
                u.getItem().getNomeItem(),
                u.getPatrimonio(),
                u.getEstado(),
                u.getObservacao(),
                u.getSetor()   != null ? u.getSetor().getNomeSetor() : null,
                u.getUsuario() != null ? u.getUsuario().getNome()    : null
        );
    }
}