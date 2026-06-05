package AssetTrack.dto;

import AssetTrack.model.Manutencao;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record ManutencaoResponseDTO(
        UUID idManutencao,
        String nomeEquipamento,
        String nomeTecnico,
        String tipoManutencao,
        LocalDateTime dataInicio,
        LocalDateTime dataConclusao,
        String descricaoServico,
        BigDecimal custoManutencao,
        String status
) {
    public ManutencaoResponseDTO(Manutencao m) {
        this(
                m.getIdManutencao(),
                m.getEquipamento().getNomeEquipamento(),
                m.getTecnico().getNome(),
                m.getTipoManutencao(),
                m.getDataInicio(),
                m.getDataConclusao(),
                m.getDescricaoServico(),
                m.getCustoManutencao(),
                m.getStatus() == null ? "ATIVA" : m.getStatus()
        );
    }
}