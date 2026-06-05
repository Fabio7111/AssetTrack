package AssetTrack.dto;

import AssetTrack.model.Equipamento;
import java.time.LocalDateTime;
import java.util.UUID;

public record EquipamentoResponseDTO(
        UUID idEquipamento,
        String nomeEquipamento,
        String numeroSerie,
        String statusAtual,
        LocalDateTime dataCadastro,
        String nomeSetor,
        UUID idAquisicao
) {
    public EquipamentoResponseDTO(Equipamento eq) {
        this(
                eq.getIdEquipamento(),
                eq.getNomeEquipamento(),
                eq.getNumeroSerie(),
                eq.getStatusAtual(),
                eq.getDataCadastro(),
                eq.getSetor() != null ? eq.getSetor().getNomeSetor() : "Sem Setor",
                eq.getAquisicao() != null ? eq.getAquisicao().getIdAquisicao() : null // <-- MAPEAR AQUI
        );
    }
}