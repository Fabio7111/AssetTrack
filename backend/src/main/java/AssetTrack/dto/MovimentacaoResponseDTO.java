package AssetTrack.dto;

import AssetTrack.model.Movimentacao;
import java.time.LocalDateTime;
import java.util.UUID;

public record MovimentacaoResponseDTO(
        UUID idMovimentacao,
        String equipamento,
        String setorOrigem,
        String setorDestino,
        String responsavel,
        LocalDateTime dataMovimentacao,
        String observacao
) {
    public MovimentacaoResponseDTO(Movimentacao m) {
        this(
                m.getIdMovimentacao(),
                m.getEquipamento().getNomeEquipamento(),
                m.getSetorOrigem() != null ? m.getSetorOrigem().getNomeSetor() : "Sem Setor",
                m.getSetorDestino().getNomeSetor(),
                m.getResponsavel().getNome(),
                m.getDataMovimentacao(),
                m.getObservacao()
        );
    }
}