package AssetTrack.dto;

import AssetTrack.model.SolicitacaoManutencao;
import java.time.LocalDateTime;
import java.util.UUID;

public record SolicitacaoResponseDTO(
        UUID idSolicitacao,
        String equipamento,
        String solicitante,
        String descricaoProblema,
        String status,
        LocalDateTime dataAbertura
) {
    public SolicitacaoResponseDTO(SolicitacaoManutencao s) {
        this(
                s.getIdSolicitacaoManutencao(),
                s.getEquipamento().getNomeEquipamento(),
                s.getUsuarioSolicitante().getNome(),
                s.getDescricaoProblema(),
                s.getStatusSolicitacao(),
                s.getDataAbertura()
        );
    }
}