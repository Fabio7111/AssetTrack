package AssetTrack.dto;

import AssetTrack.model.AuditoriaItem;
import java.util.UUID;

public record AuditoriaItemSalvoDTO(
        UUID id,
        String tipo,
        String nome,
        String contexto,
        Integer quantidadeContada,
        String numeroSerieContado,
        Boolean foiEncontrado,
        String observacao
) {
    public static AuditoriaItemSalvoDTO de(AuditoriaItem ai) {
        boolean isEquip = ai.getEquipamento() != null;
        return new AuditoriaItemSalvoDTO(
                isEquip ? ai.getEquipamento().getIdEquipamento() : ai.getItemEstoque().getIdItem(),
                isEquip ? "EQUIPAMENTO" : "ESTOQUE",
                isEquip ? ai.getEquipamento().getNomeEquipamento() : ai.getItemEstoque().getNomeItem(),
                isEquip
                        ? (ai.getEquipamento().getSetor() != null ? ai.getEquipamento().getSetor().getNomeSetor() : "—")
                        : ai.getItemEstoque().getCategoria(),
                ai.getQuantidadeContada(),
                ai.getNumeroSerieContado(),
                ai.getFoiEncontrado(),
                ai.getObservacao()
        );
    }
}