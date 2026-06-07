package AssetTrack.dto;

import AssetTrack.model.Avaliacao;
import AssetTrack.model.SolicitacaoManutencao;
import java.time.LocalDateTime;
import java.util.UUID;

public record SolicitacaoManutencaoResponseDTO(
        UUID idSolicitacao,
        String tipo,
        String descricaoProblema,
        String nomeEquipamento,
        String nomeSolicitante,
        String status,
        LocalDateTime dataAbertura,
        LocalDateTime dataConclusao,
        boolean avaliada,
        Integer nota,
        String comentarios
) {
    public SolicitacaoManutencaoResponseDTO(SolicitacaoManutencao s, Avaliacao avaliacao) {
        this(
                s.getIdSolicitacaoManutencao(),
                "MANUTENCAO",
                s.getDescricaoProblema(),
                s.getEquipamento() != null ? s.getEquipamento().getNomeEquipamento() : null,
                s.getUsuarioSolicitante() != null ? s.getUsuarioSolicitante().getNome() : null,
                s.getStatusSolicitacao(),
                s.getDataAbertura(),
                s.getDataConclusao(),
                avaliacao != null,
                avaliacao != null ? avaliacao.getNotaServico() : null,
                avaliacao != null ? avaliacao.getComentarios() : null
        );
    }
}