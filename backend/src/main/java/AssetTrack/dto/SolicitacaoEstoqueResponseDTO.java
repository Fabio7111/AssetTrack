package AssetTrack.dto;

import AssetTrack.model.Avaliacao;
import AssetTrack.model.SolicitacaoEstoque;
import java.time.LocalDateTime;
import java.util.UUID;

public record SolicitacaoEstoqueResponseDTO(
        UUID idSolicitacao,
        String tipo,
        String nomeItem,
        Integer quantidadeSolicitada,
        String observacao,
        String nomeSolicitante,
        String status,
        LocalDateTime dataAbertura,
        LocalDateTime dataConclusao,
        boolean avaliada,
        Integer nota,
        String comentarios
) {
    public SolicitacaoEstoqueResponseDTO(SolicitacaoEstoque s, Avaliacao avaliacao) {
        this(
                s.getIdSolicitacaoEstoque(),
                "ESTOQUE",
                s.getItem() != null ? s.getItem().getNomeItem() : null,
                s.getQuantidadeSolicitada(),
                s.getObservacao(),
                s.getUsuarioSolicitante() != null ? s.getUsuarioSolicitante().getNome() : null,
                s.getStatusPedido(),
                s.getDataSolicitacao(),
                s.getDataConclusao(),
                avaliacao != null,
                avaliacao != null ? avaliacao.getNotaServico() : null,
                avaliacao != null ? avaliacao.getComentarios() : null
        );
    }
}