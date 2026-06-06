package AssetTrack.dto;

import AssetTrack.model.MovimentacaoEstoque;
import java.time.LocalDateTime;
import java.util.UUID;

public record MovimentacaoEstoqueResponseDTO(
        UUID idMovimentacao,
        String nomeItem,
        String patrimonio,
        String tipo,
        Integer quantidade,
        String nomeUsuario,
        String nomeSetor,
        String observacao,
        LocalDateTime dataHora
) {
    public MovimentacaoEstoqueResponseDTO(MovimentacaoEstoque m) {
        this(
                m.getIdMovimentacao(),
                m.getItem().getNomeItem(),
                m.getUnidade() != null ? m.getUnidade().getPatrimonio() : null,
                m.getTipo(),
                m.getQuantidade(),
                m.getUsuario() != null ? m.getUsuario().getNome()       : null,
                m.getSetor()   != null ? m.getSetor().getNomeSetor()    : null,
                m.getObservacao(),
                m.getDataHora()
        );
    }
}