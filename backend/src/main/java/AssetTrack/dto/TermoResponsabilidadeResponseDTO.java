package AssetTrack.dto;

import AssetTrack.model.TermoResponsabilidade;
import java.time.LocalDateTime;
import java.util.UUID;

public record TermoResponsabilidadeResponseDTO(
        UUID idTermo,
        String nomeEquipamento,
        String numeroSerie,
        String nomeUsuario,
        String statusTermo,
        LocalDateTime dataEmissao,
        LocalDateTime dataDevolucao
) {
    public TermoResponsabilidadeResponseDTO(TermoResponsabilidade t) {
        this(
                t.getIdTermo(),
                t.getEquipamento() != null ? t.getEquipamento().getNomeEquipamento() : null,
                t.getEquipamento() != null ? t.getEquipamento().getNumeroSerie() : null,
                t.getUsuario() != null ? t.getUsuario().getNome() : null,
                t.getStatusTermo(),
                t.getDataEmissao(),
                t.getDataDevolucao()
        );
    }
}