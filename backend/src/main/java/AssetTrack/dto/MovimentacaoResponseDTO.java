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
        LocalDateTime dataInicio,
        LocalDateTime dataConclusao,
        String observacao,
        String status
) {
    public MovimentacaoResponseDTO(Movimentacao m) {
        this(
                m.getIdMovimentacao(),
                m.getEquipamento() != null ? m.getEquipamento().getNomeEquipamento() : "Desconhecido",
                m.getSetorOrigem() != null ? m.getSetorOrigem().getNomeSetor() : "Estoque",
                m.getSetorDestino() != null ? m.getSetorDestino().getNomeSetor() : "Sem Setor",
                m.getResponsavel() != null ? m.getResponsavel().getNome() : "Não informado",
                m.getDataMovimentacao(),
                m.getDataInicio(),
                m.getDataConclusao(),
                m.getObservacao(),
                m.getStatus()
        );
    }
}